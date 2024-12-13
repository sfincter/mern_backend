const express = require('express')
const router = express.Router()
const cors = require('cors')
const {test, registerUser, loginUser, getProfile} = require('../controllers/authController')

router.use(
    cors({
        credentials: true, 
        origin: 'https://mern-frontend-henna-three.vercel.app'
    })
)

router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)

module.exports = router