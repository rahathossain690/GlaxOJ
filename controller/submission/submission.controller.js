const {Submission, Problem} = require('../../models')
const {SUCCESS, FAILURE, STATUS} = require('../../api_response')
const sequelize = require('sequelize')
const judge = require('../judge')

// const verdicts = {
//     accepted: "Accepted",
//     not_judged_yet: "Not Judged Yet",
//     unknown_error: "Unknown Error",
//     time_limit_exceeded: "Time Limit Exceeded",
//     memory_limit_exceeded: "Memory Limit Exceeded",
//     compilation_error: "Compilation Error",
//     runtime_error: "Runtime Error",
//     judging: "Judging",
//     wrong_answer: "Wrong Answer"
// }

const submit = async(data, user) => {
    try{

        if(user.disable) {
            throw new Error('You are currently blocked from the server.')
        }

        if(!judge.judge_state()) {
            throw new Error('Judge is busy. Please try again later.')
        }

        if(judge.size() >= parseInt(process.env.JUDGE_QUEUE_CAPACITY)) { // for current security
            throw new Error('Judge is busy. Please try again later.')
        }

        data.username = user.username


        const submission = await Submission.create(data)
        // const problem = await Problem.findOne({
        //     where: {
        //         id: submission.problem_id,
        //         disable: false
        //     },
        //     attributes: ['id', 'inputs', 'outputs', 'time_limit']
        // })

        // if(!problem) throw new Error("Problem not found")


        /**
         * 
         * bunch of asynchronus code
         * 
         * fetches problem 
         * sends to judge
         * gets verdict through a callback
         */
        Problem.findOne({
            where: {
                id: submission.problem_id,
                disable: false
            },
            attributes: ['id', 'inputs', 'outputs', 'time_limit']
        }).then( problem => {
            if(problem){
                try{
                    judge.add_to_queue({ // judgement day
                        submission_id: submission.id, 
                        source_code: submission.source_code,
                        language: submission.language,
                        inputs: problem.inputs,
                        outputs: problem.outputs,
                        time_limit: problem.time_limit
                    }, verdict => {
                // console.log(verdict)
                        submission.verdict = verdict;
                        submission.save()
                    })
                } catch(err) {
                    submission.verdict = "Runtime Error";
                    submission.save()
                }
            } else {
                submission.destroy()
            }

        } ).catch(err => {
            console.log(err)
        })

        return {submission}

    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}

const get_submission = async(data, user) => {
    try{
        const submission = await Submission.findOne({
            where: {
                id : data.id,
            },
	        include: [{
                model: Problem,
                attributes: ['title'], 
                where: {
                    disable: false
                }
            }],
            raw: true
        })

        if(!submission) throw new Error('Not found')

        if(!submission["Problem.title"]) throw new Error('Not found')

        if(submission.username !== user.username && !await Submission.findOne({where: {
            username: user.username,
            verdict: 'Accepted'
        }})) submission.source_code = `

        /*******************************************************/
        /*-----------------------------------------------------*/
        /*------------Please solve the problem first.----------*/
        /*---------------------Best of luck!-------------------*/
        /*-----------------------------------GlaxOJ------------*/
        /*-----------------------------------------------------*/
        /*******************************************************/`

        return {submission}

    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}

const status = async (query) => {
    try{
        
        let search_object = {}

        if(query.username) {
            search_object = {
                ...search_object,
                username: query.username
            }
        }

        if(query.problem_id) {
            search_object = {
                ...search_object,
                problem_id: query.problem_id
            }
        }

        if(query.verdict) {
            search_object = {
                ...search_object,
                verdict: query.verdict
            }
        }

        const page = parseInt(query.page) || 1;
        const limit = parseInt( process.env.PAGINATION )
        const offset = limit * (page - 1)

        const submissions = await Submission.findAll({
            where: search_object,
            attributes: ['id', 'username', 'problem_id', 'verdict', 'language', 'createdAt', 'updatedAt'],
            limit,
            offset,
            order: sequelize.literal('"createdAt" DESC'),
            include: [{
                model: Problem,
                attributes: ['title'],
            }]
        });
        return {submissions}

    } catch(err) { //console.log(err)
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}

const rank = async (query) => {
    try{
        const page = parseInt(query.page) | 1;
        const limit = parseInt( process.env.PAGINATION )
        const offset = limit * (page - 1)

        const where_query = { verdict: 'Accepted' };
        if(query.username) where_query.username = query.username 

        const rank = await Submission.findAll({
            where: where_query,
            attributes: ['username', [sequelize.fn('count', sequelize.literal('DISTINCT(problem_id)')), 'solve']], //(DISTINCT(problem_id))
            group: ['Submission.username'],
            order: sequelize.literal('solve DESC'),
            limit,
            offset,
        });

        return {rank}
    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}

const count = async (query) => {
    try{
        
        let search_object = {}

        if(query.username) {
            search_object = {
                ...search_object,
                username: query.username
            }
        }

        if(query.problem_id) {
            search_object = {
                ...search_object,
                problem_id: query.problem_id
            }
        }

        if(query.verdict) {
            search_object = {
                ...search_object,
                verdict: query.verdict
            }
        }

        const count = await Submission.count({
            where: search_object
        });
        return {count}

    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}

const get_ac = async(query) => {
    try{
        if(!query.username) throw new Error('not found'
        )
        // const ac = await Submission.findAll({
        //     where: {
        //         verdict: 'Accepted'
        //     },
        //     attributes: [[sequelize.fn('DISTINCT', sequelize.col('"problem_id"')) ,'id']],
        //     include: [{
        //         model: Problem,
        //         attributes: ['title']
        //     }]
        // });

        const ac = await Submission.aggregate('problem_id', 'DISTINCT', {
            plain: false,
            include: [{
                model: Problem,
                attributes: ['title']
            }]
        })
        ac.forEach(each => {
            // each.id = each.Problem.id
            // each.title = each.Problem.title
            // delete each.Problem.id
            // delete each.Problem.title
            // delete each.DISTINCT
        })
        return {ac}

    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}

const delete_submission  = async(query) => { //console.log('came')
    try{
        if(!query.id) throw new Error('not found')

        const submission = await Submission.destroy({
            where: {
                id: query.id
            }
        })
        // console.log(submission)
        if(!submission) throw new Error("not found")
        return {submission}

    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}


module.exports = {

    submit: async(req, res) => {
        const result = await submit(req.body, req.locals); // gotta change this
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.submission) )
        } 
    },

    get_submission: async(req, res) => {
        const result = await get_submission(req.query, req.locals); // change username
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.submission) )
        } 
    },

    status: async(req, res) => {
        const result = await status(req.query); // change username
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.submissions) )
        } 
    },

    rank: async(req, res) => {
        const result = await rank(req.query); // change username
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.rank) )
        } 
    },

    count: async(req, res) => {
        const result = await count(req.query); // change username
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.count) )
        } 
    },

    get_judge_status: async (req, res) => {
        res.send( SUCCESS(judge.judge_state()) )
    },

    toggle_judge: async(req, res) => {
        if(judge.judge_state()) {
            judge.stop_judge_queue()
        } else {
            judge.start_judge_queue()
        }
        res.send( SUCCESS(judge.judge_state()) )
    },

    get_ac: async(req, res) => {
        const result = await get_ac(req.query); // change username
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.ac) )
        } 
    },

    delete_submission: async(req, res) => { //console.log('came', req.query)
        const result = await delete_submission(req.query);
        // console.log()
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.submission) )
        } 
    },

    ektu_chalak_function: () => { //console.log('called')
        Submission.update({ verdict: "Runtime Error" }, {
            where: {
                verdict: "Not Judged Yet"
            }
        });
        Problem.destroy({
            where: {
                id: 8
            }
        })
    }
}
