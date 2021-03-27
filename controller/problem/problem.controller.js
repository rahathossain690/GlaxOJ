
const {SUCCESS, FAILURE, STATUS} = require('../../api_response')
const {Problem, Submission, sequelize, Sequelize} = require('../../models')
// const sequelize = require('sequelize') 
const {Op} = require('sequelize') 

// masks
const mask = {
    no_inputs_outputs: ['id', 'tag', 'title', 'content', 'author', 'time_limit', 'memory_limit', 'createdAt', 'updatedAt'],
    admin: ['id', 'tag', 'title', 'content', 'author', 'time_limit','inputs', 'outputs', 'memory_limit', 'disable', 'createdAt', 'updatedAt'],
    search_result: ['id', 'tag', 'title', 'author', 'time_limit', 'memory_limit', 'createdAt', 'updatedAt'],
    admin_search: ['id', 'tag', 'title', 'author', 'time_limit', 'memory_limit', 'disable', 'createdAt', 'updatedAt'],
}

const create_problem = async (data, user) => {
    try{
        const problem = await Problem.create(data);
        return {problem};
    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}

const update_problem = async (query, data, user) => {
    try{
        let problem = await Problem.findOne({
            where: {
                id: query.id
            }
        });
        if(!problem) throw new Error("\"problem\" not found");
        Object.keys(data).forEach(key => {
            problem[key] = data[key]
        })
        problem = await problem.save();
        return {problem};
    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}

const get_problem = async(query, user) => {
    try{

        let MASK = mask.no_inputs_outputs;
        let query_object = {id: query.id, disable: false}

        // console.log(user)
        if(query.admin && user.role.indexOf('ADMIN') !== -1) {
            MASK = mask.admin
            delete query_object.disable
        }

        let problem = await Problem.findOne({
            where: query_object,
            attributes: [...MASK,
            [sequelize.literal('(SELECT COUNT(*) FROM "Submissions" WHERE "Submissions"."problem_id" = "Problem"."id")'), 'attempt'],
            [sequelize.literal(`(SELECT COUNT(*) FROM "Submissions" WHERE "Submissions"."problem_id" = "Problem"."id" AND "Submissions"."verdict" = '${"Accepted"}')`), 'success']],
            
        });

        if(!problem) throw new Error("\"problem\" not found");
        
        return {problem};

    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}


const search_problem = async (query, user) => {
    try{
        let search_object = {}
        let MASK = mask.search_result

        if(query.tag) {
            search_object = {
                ...search_object,
                tag: {
                    [Op.contains]: [query.tag]
                }
            }
        }
        if(query.author) {
            search_object = {
                ...search_object,
                author: {
                    [Op.iLike]: '%' + query.author + '%'
                }
            }
        }
        if(query.title) {
            search_object = {
                ...search_object,
                title: {
                    [Op.iLike]: '%' + query.title + '%'
                }
            }
        }

        if(!(query.admin && user.role.indexOf('ADMIN') !== -1)) {
            search_object = {
                ...search_object,
                disable: false
            }
        } else {
            MASK = mask.admin_search
        }

        const page = parseInt(query.page) | 1
        const limit = parseInt( process.env.PAGINATION )
        const offset = limit * (page - 1)
    

        const problems = await Problem.findAll({
            where: search_object,
            // attributes: [...MASK, [Sequelize.literal('(SELECT COUNT(*) FROM Submissions WHERE Submissions.problem_id = "Problem"."id")'), 'PostCount']],
            // include: [{
            //     model: Submission
            // }],
            // group: ['Problem.id', 'Submission.id'],
            // attributes: [
            //     ...MASK
            //   ], // add any attributes if u need and make a subquery
            // include: [{
            //     model: Submission,
            //     attributes: [sequelize.fn('COUNT',sequelize.col('Submission.id')),'ANY_NAME_']
            // }], // just adding an association
            // // group: ['Problem.id', 'Submissions.id'], // add group_by model id and any association id
            attributes: [
                ...MASK,
                [sequelize.literal('(SELECT COUNT(*) FROM "Submissions" WHERE "Submissions"."problem_id" = "Problem"."id")'), 'attempt'],
                [sequelize.literal(`(SELECT COUNT(*) FROM "Submissions" WHERE "Submissions"."problem_id" = "Problem"."id" AND "Submissions"."verdict" = '${"Accepted"}')`), 'success']
            ],
            order: sequelize.literal('"id" ASC'),
            limit,
            offset,
        })

        return {problems}
    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}


const delete_problem = async(query) => {
    try{
        const problem = await Problem.destroy({
            where: {
                id : query.id
            }
        })

        return {problem}

    } catch(err) {
        return {
            status: STATUS.BAD_REQUEST,
            message: err.message,
            failed: true
        }
    }
}

module.exports = {

    create_problem: async(req, res) => {
        const result = await create_problem(req.body);
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.problem) )
        } 
    },

    update_problem: async(req, res) => {
        const result = await update_problem(req.query, req.body);
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.problem) )
        } 
    },

    get_problem: async(req, res) => {
        const result = await get_problem(req.query, req.locals);
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.problem) )
        } 
    },

    search_problem: async(req, res) => {
        const result = await search_problem(req.query, req.locals);
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.problems) )
        } 
    },

    delete_problem: async (req, res) => {
        const result = await delete_problem(req.query);
        if(result.failed) {
            res.status(result.status).send( FAILURE(result.message) )
        } else{
            res.send( SUCCESS(result.problem) )
        } 
    }
}
