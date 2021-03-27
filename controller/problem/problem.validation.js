const joi = require('joi')
const {FAILURE, STATUS} = require('../../api_response')


const joi_check = (data, check_object_schema) => {
    const validation = joi.object(check_object_schema).validate(data)
    if(!!validation.error) return validation.error.details.map(item => item.message)
    return false
}


module.exports = {

    create_problem: (req, res, next) => {
        const validation_error = joi_check(req.body, {

            title:          joi.string().required(),
            tag:            joi.array().items(joi.string()).required(),
            content:        joi.string().required(),
            inputs:         joi.array().items(joi.string()).required(),
            outputs:        joi.array().items(joi.string()).required(),
            author:         joi.string(),
            time_limit:     joi.number().integer().positive().required(),
            memory_limit:   joi.number().integer().positive().required(),
            disable:        joi.boolean()

        }) 
        if (!!validation_error) {
            res.status(STATUS.BAD_REQUEST).send( FAILURE(validation_error) )
            return validation_error;

        } else {
            next()
        }
    },


    problem_id_query: (req, res, next) => {
        const validation_error = joi_check(req.query, {

            id:             joi.number().integer().positive().required()
            
        }) 
        if (!!validation_error) {
            res.status(STATUS.BAD_REQUEST).send( FAILURE(validation_error) )
            return validation_error;

        } else {
            next()
        }
    },

    update_problem: (req, res, next) => {
        const validation_error = joi_check(req.body, {
            

            title:          joi.string(),
            tag:            joi.array().items(joi.string()),
            content:        joi.string(),
            inputs:         joi.array().items(joi.string()),
            outputs:        joi.array().items(joi.string()),
            author:         joi.string(),
            time_limit:     joi.number().integer().positive(),
            memory_limit:   joi.number().integer().positive(),
            disable:        joi.boolean()


        }) 
        if (!!validation_error) {
            res.status(STATUS.BAD_REQUEST).send( FAILURE(validation_error) )
            return validation_error;

        } else {
            next()
        }
    },

    get_problem: (req, res, next) => {
        const validation_error = joi_check(req.query, {
            
            id: joi.number().integer().positive().required(),
            admin: joi.boolean()

        }) 
        if (!!validation_error) {
            res.status(STATUS.BAD_REQUEST).send( FAILURE(validation_error) )
            return validation_error;

        } else {
            next()
        }
    },

    search_problem: (req, res, next) => {
        const validation_error = joi_check(req.query, {
            
            tag: joi.string(),
            author: joi.string(),
            title: joi.string(),
            admin: joi.boolean(),
            page: joi.number().integer().positive(),

        }) 
        if (!!validation_error) {
            res.status(STATUS.BAD_REQUEST).send( FAILURE(validation_error) )
            return validation_error;

        } else {
            next()
        }
    }

}