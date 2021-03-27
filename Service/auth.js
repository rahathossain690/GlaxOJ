const {User} = require('../models')
const {STATUS, FAILURE} = require('../api_response')

const {verify} = require('./jwt')


const authenticate = async(cookie) => {
    const username = verify(cookie);
    if(!username) return null;
    const user = await User.findOne({
        where: {
            username,
        },
        raw: true
    })
    if(user.role == null) user.role = []
    return user
}

module.exports = {

    is_admin: async(req, res, next) => {
        // if(process.env.ONLY_RAHAT_ISREAL) req.session.username = 'rahathossain' // TODO: DELETE THIS
        req.locals = await authenticate(req.cookies.glaxoj)
        if(req.locals && req.locals.role.indexOf('ADMIN') !== -1) next()
        else res.status(STATUS.UNAUTHORIZED).send( FAILURE("not an admin") )
    },

    is_user: async(req, res, next) => {
        // if(process.env.ONLY_RAHAT_ISREAL) req.session.username = 'rahathossain'// TODO: DELETE THIS
        req.locals = await authenticate(req.cookies.glaxoj)
        if(req.locals) next()
        else res.status(STATUS.UNAUTHORIZED).send( FAILURE("not an user") )
    },

    parse : async(req, res, next) => {
        // if(process.env.ONLY_RAHAT_ISREAL) req.session.username = 'rahathossain'// TODO: DELETE THIS
        req.locals = await authenticate(req.cookies.glaxoj)
        next()
    }
}