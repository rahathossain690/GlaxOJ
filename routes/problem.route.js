const router = require('express').Router()

const problem_controller = require('../controller/problem/problem.controller')
const problem_validation = require('../controller/problem/problem.validation')

const auth_service = require('../Service/auth')

router
    .post('/', auth_service.is_admin, problem_validation.create_problem, problem_controller.create_problem)
    .get('/', auth_service.parse, problem_validation.get_problem, problem_controller.get_problem)
    .put('/', auth_service.is_admin, problem_validation.problem_id_query, problem_validation.update_problem, problem_controller.update_problem)
    .delete('/', auth_service.is_admin, problem_validation.problem_id_query, problem_controller.delete_problem)
    .get('/search', auth_service.parse, problem_validation.search_problem, problem_controller.search_problem)

module.exports = router;