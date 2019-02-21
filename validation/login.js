const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateLoginInput(data) {
    let errors = {}

    if (Object.keys(data).length == 0) {
        errors.value = 'Values not supplied'

        return {
            errors,
            isValid: isEmpty(errors)
        }
    }
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''

    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is required'
    }

    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required'
    }
    return {
        errors,
        isValid: Object.keys(errors).length == 0
    }
}