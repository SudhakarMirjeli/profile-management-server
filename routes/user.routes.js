const router = require('express').Router()
const UserController = require('../controllers/user.controller')

router.get('/:userId', (req, res) => {
    UserController.getUserProfile(req, res)
})

router.get('/', (req, res) => {
    UserController.getUserProfile(req, res)
})

router.post('/', UserController.upload.single('profilePicture'), UserController.addUserProfile);

router.put('/:userId',
    UserController.upload.single('profilePicture'),
    UserController.updateUserProfile
)

router.delete('/:userId', (req, res) => {
    UserController.removeUserProfile(req, res)
})


module.exports = router