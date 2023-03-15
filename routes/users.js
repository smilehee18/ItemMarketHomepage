const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const passport = require('passport')
const { forwardAuthenticated } = require('./auth')

// Use Models
const User = require('../models/user'); 
const db = "mongodb://127.0.0.1/hostsDB"
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})

var myname;
var myid;
var myphone;
var mypass;

//name page
router.get('/name', (req,res)=>
{
  User.find({_id:myid}, (err, output) => {
    console.log(output)
    if(err)
        {
           res.status(500).send({error : 'database failure~'});
           return;
        }
        res.render('edit_profile', {newuser:output, myname:myname, myid:myid, myphone:myphone, mypass:mypass})
    })
})

//here
router.post('/dashboard', (req, res) => {
    res.render('dashboard', {name:req.body.name})
})

// Login handle
router.post('/login', (req, res, next) => {
    myname = req.body.name;
    myphone = req.body.phone;
    mypass = req.body.password;
    User.findOne({phone:myphone}, (err,one) => 
        {
            if(err)
            {
                res.status(500).send({error : 'error..'});
                return;
            }
            if(one) {
              myid = one._id
              console.log(myid);
            }
        }),
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureMessage : true
        })(req, res, next)
})

// Login page
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login')
})

//name page
router.post('/name', (req,res)=>
{
  User.findOne({_id:myid}, (err, output) => {
    console.log(output)
    if(err)
        {
           res.status(500).send({error : 'database failure~'});
           return;
        }
        res.redirect('name')
    })
})

// Register page
router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register')
})

// Router page in post
router.post('/register', (req, res) => {
    const { name, phone, password, password2 } = req.body
    let errors = []
    // Check passwordd match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not matching ... try again' })
    }
    // Check password's length
    if (password.length < 4) {
        errors.push({ msg: 'Password should be at least 4 characters' })
    }
    // Error messages
    if (errors.length > 0) {
        res.render('register', {
            errors, 
            name, phone, password, password2
        })
    } else {
        // Validation passed
        User.findOne({phone:phone})
            .then(user => {
                if(user) {
                    //User exists
                    errors.push({ msg: 'Phone is already registered'})
                    res.render('register', {
                        errors,
                        name, phone, password, password2
                    })
                } else {
                    const newUser = new User({
                        name, phone, password
                    })
                    // Hash Password
                    bcrypt.hash(newUser.password, 10, (err,hash) => {
                        if(err) throw err;
                        newUser.password = hash
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'Your are now registered and can log in ')
                                res.redirect('login')
                            })
                            .catch(err => console.log(err))
                        })
               }
        })
}})

router.get('/logout', (req, res) => {
    req.logout(() => {})
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

module.exports = router