const User = require('../models/User')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const { urlencoded } = require('body-parser')

const test = (req, res) => {
    res.json('test is working')
}



const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body
        if (!name) {
            return res.json({
                error: 'Имя обязательно'
            })
        }
        if (!email) {
            return res.json({
                error: 'Почта обязательна'
            })
        }
        if (!password || password.length < 5) {
            return res.json ({
                error: 'Пароль должен быть не короче 5 символов'
            })
        }

        const exist = await User.findOne({ email })
        if (exist) {
            return res.json({
                error: 'Email уже занят'
            })
        }

        const hashedPassword = await hashPassword(password)
    
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })

} catch (error) {

}

}

const loginUser =  async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user) {
            return res.json({
                error: 'Пользователь не найден'
            })
        }

        const match = await comparePassword(password, user.password)
        if (match) {
            jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err
                res.cookie('token', token).json(user)
            })
        }
        if (!match) {
            res.json({
                error: 'Пароль не верный'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const getProfile = (req, res) => {
    const {token} = req.cookies
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if(err) throw err
            res.json(user)
        })
    } else {
        res.json(null)
    }
}

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
}