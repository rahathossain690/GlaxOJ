const joi = require('joi')
const {FAILURE, STATUS} = require('../../api_response')


const joi_check = (data, check_object_schema) => {
    const validation = joi.object(check_object_schema).validate(data)
    if(!!validation.error) return validation.error.details.map(item => item.message)
    return false
}


module.exports = {

    submit: (req, res, next) => {
        const validation_error = joi_check(req.body, {

            
            problem_id: joi.number().required(),
            source_code: joi.string().max(2000).required(),
            language: 'cpp'

        }) 
        if (!!validation_error) {
            res.status(STATUS.BAD_REQUEST).send( FAILURE(validation_error) )
            return validation_error;

        } else {
            next()
        }
    },

}