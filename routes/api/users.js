const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/keys')

// Load input validator
const validatorRegisterInput = require('../../validation/register')
const validatorLoginInput = require('../../validation/login')

// Load User model
const User = require('../../models/User')

// @route   GET api/users/test
// @desc    Tests users route
// @access  Private
router.get('/test', (req, res) => res.json({
    msg: 'User works'
}))

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    const {
        errors,
        isValid
    } = validatorRegisterInput(req.body)

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                errors.email = 'Email already exist'
                return res.status(400).json(errors)
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })
                const newUser = new User({
                    ...req.body,
                    avatar
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) console.log(err)
                        newUser.password = hash
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})

// @route   GET api/users/login
// @desc    Login User / Returning JWT token
// @access  Public
router.post('/login', (req, res) => {

    const {
        errors,
        isValid
    } = validatorLoginInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    const {
        email,
        password
    } = req.body

    // Find user by email
    User.findOne({
            email
        })
        .then(user => {
            // Check email
            if (!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors)
            }

            // Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User Matched

                        const payload = {
                            id: user._id,
                            name: user.name,
                            avatar: user.avatar
                        }
                        // Sign Token
                        JWT.sign(payload, keys.secretOrKey, {
                            expiresIn: 3600
                        }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        })
                    } else {
                        errors.password = 'Password Incorrect'
                        return res.status(400).json(errors)
                    }
                })
        })
})


// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

module.exports = router