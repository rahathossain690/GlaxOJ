const router = require('express').Router()

const user_controller = require('../controller/user/user.controller')

const auth_service = require('../Service/auth')


router.get('/', user_controller.get_user)
router.put('/', auth_service.is_admin, user_controller.update_user),
router.get('/all', auth_service.is_admin, user_controller.get_all_user)
router.get('/count', auth_service.is_admin, user_controller.count_user)

router.get('/is_user', auth_service.is_user, user_controller.nothing)
router.get('/is_admin', auth_service.is_admin, user_controller.nothing)


router.get('/logout', user_controller.logout)	
// router.get('/set', user_controller.set_session_temporary)

module.exports = router 
