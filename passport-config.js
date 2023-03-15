const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('./models/user')
const bcrypt = require('bcrypt')

function initialize(passport) {
    const authenticateUser = (phone, password, done) => {
        User.findOne({phone:phone})
            .then(user => {
                if(!user) {
                    return done(null, false, { message: 'That User is not registered'})
                }
                bcrypt.compare(password, user.password)
                .then(same => {
                    if(same) { return done(null, user) }
                    else { return done(null, false, { message: 'Password incorrect'})}
                    })
                .catch(err => { console.log(err) }) 
              })
              .catch(err => console.log('err'))
    }
    
    passport.use(new LocalStrategy({ usernameField:'phone'}, authenticateUser))
    passport.serializeUser((user, done) => { done(null, user.id) })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => { done(null, user.id) })
    })
}

module.exports = initialize