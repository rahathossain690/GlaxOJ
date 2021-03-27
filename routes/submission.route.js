const router = require('express').Router()

const submission_controller = require('../controller/submission/submission.controller')
const submission_validation = require('../controller/submission/submission.validation')


const auth_service = require('../Service/auth')


const rateLimit = require("express-rate-limit");
const { route } = require('.');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});


router.post('/submit', limiter, auth_service.is_user, submission_validation.submit, submission_controller.submit)
router.get('/', auth_service.is_user, submission_controller.get_submission)
router.get('/status', submission_controller.status)
router.delete('/', auth_service.is_admin, submission_controller.delete_submission)

router.get('/rank', submission_controller.rank)
router.get('/count', submission_controller.count)
// router.get('/ac', submission_controller.get_ac)

router.get('/judge_status', auth_service.is_admin, submission_controller.get_judge_status)
router.post('/judge_toggle', auth_service.is_admin, submission_controller.toggle_judge)


// router.get('/position', submission_controller.position) // this function is sad :( 

module.exports = router 