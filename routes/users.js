const router = require('express').Router();
const { getUserFile, getUserProfileUpdate } = require('../controllers/users');
const { userValidate } = require('../middlewares/validation');

router.get('/users/me', getUserFile);

router.patch('/users/me', userValidate, getUserProfileUpdate);

module.exports = router;
