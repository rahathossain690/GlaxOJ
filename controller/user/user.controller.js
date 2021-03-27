const {SUCCESS, FAILURE, STATUS} = require('../../api_response')
const {User, Submission, Problem} = require('../../models')
const sequelize = require('sequelize')

const {verify} = require('../../Service/jwt')


const get_user_by_username = async(username, RAW=false) => {
    return await User.findOne({
        where: {
            username,
        },
        raw: RAW
    })
}

module.exports = {
    upsert_user: async (profile) => {
        const data = {}
        data.email = profile.emails[0].value;
        let user = await User.findOne({
            where: {
                email: data.email
            }
        })
        if(user){
            return user
        }
        data.fullname = profile.displayName;
        if(profile.photos && profile.photos.length >= 0) data.image = profile.photos[0].value;
        data.username = "";
        data.fullname.split(' ').forEach(part => {
            data.username += part.toLowerCase()
        })
        if(profile.role) data.role = profile.role;
        while(true) {
            if(await User.findOne({
                where: {
                    username: data.username
                }
            })) {
                data.username += "0123456789"[ Math.floor(Math.random() * "0123456789".length) ]
            } else{
                break;
            }
        }
        user = await User.create(data);
        return user;
    },

    get_user_by_username: async (username) => {
        return await get_user_by_username(username)
    },

    get_user: async(req, res) => { //console.log('cookie', req.cookies.glaxoj, 'verified', verify(req.cookies.glaxoj))
        const username = req.query.username || verify(req.cookies.glaxoj)
// console.log('query', req.query.username)
// console.log('session', req.session.username)
// console.log('username', username)
        if(!username){
            res.status(STATUS.NOT_FOUND).send(FAILURE("\"username\" required"))
            return;
        }
        const user = await get_user_by_username(username, true);
        if(!user) res.status(STATUS.NOT_FOUND).send(FAILURE("\"username\" not found"))
        else {
            
            // all solved problems
            user.solved_problem = (await Submission.aggregate('problem_id', 'DISTINCT', {
                where: {
                    username: user.username,
                    verdict: 'Accepted'
                },
                plain: false,
                include: [{
                    model: Problem,
                    attributes: ['title']
                }]
            })).map(each => {
                return {id: each["Problem.id"], title: each["Problem.title"]}
            })
            //
            // all unsolved problems
            user.unsolved_problem = (await Submission.aggregate('problem_id', 'DISTINCT', {
                where: {
                    username: user.username,
                    verdict: {
                        [sequelize.Op.not]: 'Accepted'
                      }
                },
                plain: false,
                include: [{
                    model: Problem,
                    attributes: ['title']
                }]
            })).map(each => {
                return {id: each["Problem.id"], title: each["Problem.title"]}
            }).filter(each => {
			for(let i = 0; i < user.solved_problem.length; i++){
				if(user.solved_problem[i].id === each.id) return false
			}
			return true
		})
            // total submission
            user.total_submission = await Submission.count({
                where: {
                    username: user.username
                }
            })
            if(verify(req.cookies.glaxoj) !== user.username) delete user.email
            res.send( SUCCESS(user) )
        } 
    },

    // set_session_temporary: async(req, res) => { // temporary
    //     req.session.username = req.query.username
    //     res.send("done")
    // },

    update_user: async(req, res) => { //console.log(req.query, req.query.disable, req.query.admin)
        if(!req.query.username) res.status(STATUS.NOT_FOUND).send(FAILURE("\"username\" not found"))
        if(req.query.disable === undefined && req.query.admin === undefined) res.status(STATUS.NOT_FOUND).send(FAILURE("\"disable\" or \"admin\" not found"))
        else {
            const user = await get_user_by_username(req.query.username);
            if(!user) res.status(STATUS.NOT_FOUND).send(FAILURE("\"user\" not found"))
            else {
                // if(req.body.disable) user.disable = req.body.disable
                // if(req.body.role) user.role = req.body.role;
                // await user.save();
                // res.send( SUCCESS(user) )
                if(req.query.disable === 'true') user.disable = true
                else if(req.query.disable === 'false') user.disable = false
                if(req.query.admin === 'true' && user.email !== process.env.ADMIN_EMAIL) {
                    user.role = ['ADMIN']
                } else if(req.query.admin === 'false' && user.email !== process.env.ADMIN_EMAIL){
                    user.role = []
                }
                res.send( SUCCESS(await user.save()) )
            }
        }
    },

    get_all_user: async(req, res) => {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt( process.env.PAGINATION )
        const offset = limit * (page - 1)

        res.send( SUCCESS( await User.findAll({
            limit,
            offset
        }) ) )
    },

    count_user: async(req, res) => {
        res.send( SUCCESS( await User.count({
        }) ) )
    },

    nothing: async(req, res) => {
        res.send( SUCCESS() )
    },

    logout: async(req, res) => {
        let options = {
            maxAge: 1000 * 60 * 60 * 24 * 7, // would expire after 7 days
            // secure: true,
            sameSite: 'none',
            // domain: 'herokuapp.com',
            // httpOnly: false, // The cookie only accessible by the web server
            path: "/",
            secure: true,
            //domain: ".herokuapp.com", REMOVE THIS HELPED ME (I dont use a domain anymore)
            httpOnly: true
        }
        res.clearCookie("glaxoj", options);
        res.send(SUCCESS())
    }
}
