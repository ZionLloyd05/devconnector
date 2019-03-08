const express = require("express")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

//  DB Config
const db = require('./config/keys').mongoURI

// Connect to mongoDB
mongoose.connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err))

//--body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))


// Passport Initialization
require('./config/passport')(passport)

// CORS SET UP
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// User Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 5000

app.listen(port, () => console.log("Server running on port " + port))