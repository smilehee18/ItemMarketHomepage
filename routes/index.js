const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Item = require('../models/item')
const User = require('../models/user')
const Comment = require('../models/comment')
const bcrypt = require('bcrypt')
const { ensureAuthenticated, forwardAuthenticated } = require('./auth')
var myname; 
var myphone;
var mypass;
var myid;

const db = "mongodb://127.0.0.1/hostsDB"
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('strictQuery', true);

router.get('/', forwardAuthenticated, (req, res) => {
    res.render('index')
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    myname = req.body.name
    res.render('dashboard')
})

router.post('/dashboard', ensureAuthenticated, (req, res) => {
    myname = req.body.name
    res.render('dashboard', {name:req.body.name})
})


router.post('/get-data', ensureAuthenticated, (req,res) => {
    Item.find((err, items) => {
        if(err)
        {
           res.status(500).send({error : 'database failure~'});
           return;
        }
        res.render('show_item', {items:items, name:myname});
  })
})

router.get('/get-data', ensureAuthenticated, (req,res) => {
    Item.find((err, items) => {
        if(err)
        {
           res.status(500).send({error : 'database failure~'});
           return;
        }
        console.log(myname)
        res.render('show_item', {items:items, name:myname});
    })
});


router.post('/delete', ensureAuthenticated, (req,res) => {
    Item.deleteOne({_id: req.body.id}, (err, output) =>
       {
           if(err) 
           {
               res.status(500).send({error : 'Error in deleting!!'});
               return;
           }
           else
           {
               console.log(output);
               res.redirect('/get-data');
           }
       })
});

router.post('/insert', ensureAuthenticated, (req,res) => {
    const iitem = new Item();
    iitem.name = req.body.name;
    iitem.item = req.body.item;
    iitem.category = req.body.category;
    iitem.price = req.body.price;
    iitem.save ((err) => 
    {
        if(err)
        {
            res.status(500).send({error : 'database failure in inserting data'});
            return;
        }
        res.redirect('/get-data');
    })
});

router.post('/update',(req,res) => {
    Item.updateOne({_id:req.body.id},
       {
           name : req.body.name,
           item : req.body.item,
           category : req.body.category,
           price : req.body.price
       }, (err) =>
       {
           if(err)
           {
               res.status(500).send({error : 'error in updating!!'});
               return;
           }
           else {
           res.redirect('/get-data');
           }
       });
});

router.get('/edit', (req,res) => {
     var id = req.query.id;
     Comment.find({itemid:id}, (err, comments) => {
        if(err)
        {
           res.status(500).send({error : 'database failure~'});
           return;
        }
        res.render('edit', {id:id ,comments:comments});
    })
})

router.post('/input_comment', (req,res) =>
{
    const comm = new Comment();
    comm.itemid = req.body.id;
    comm.name = req.body.name;
    comm.content = req.body.content;
    comm.save ((err) => 
    {
        if(err)
        {
            res.status(500).send({error : 'database failure in inserting data'});
            return;
        }
        Comment.find({itemid:req.body.id}, (err, comnew) => {
            if(err)
            {
               res.status(500).send({error : 'database failure~'});
               return;
            }
            //Comment.find({itemid:comm.itemid} => {})
            res.render('edit', {id:comm.itemid, comments:comnew, myname:myname});
        })
    })
})

router.post('/search', (req, res) => {
    //const item  = new Item();
    if(req.body.sel=='username')
    {
        Item.find({name:req.body.text}, (err, item) => {
            if(err)
            {
               res.status(500).send({error : 'database failure~'});
               return;
            }
            res.render('show_item', {items:item});
        })
    }
    else if(req.body.sel == 'itemname')
    {
        Item.find({item:req.body.text}, (err, item) => {
            if(err)
            {
               res.status(500).send({error : 'database failure~'});
               return;
            }
            res.render('show_item', {items:item});
        })
    }
})

router.post('/update_profile', (req,res) => {
    myname = req.body.name
    myphone = req.body.phone
    mypass = req.body.pass
    myid = req.body.id
    console.log(myname)

    User.updateOne({_id:myid}, 
        {
            name : myname,
            phone : myphone,
            password : mypass
        }, (err) =>
        {
            if(err)
            {
                res.status(500).send({error : 'error in updating!!'});
                return;
            }
            else {
            res.redirect('edit_profile');
            }
        })
})

router.get('/edit_profile', (req,res) => {
        User.find({_id:myid}, (err, users) => {
            if(err)
            {
               res.status(500).send({error : 'database failure~'});
               return;
            }
            res.render('edit_profile', {newuser:users, myid:myid, myname:myname, myphone:myphone, mypass:mypass})
        })
})

    
module.exports = router;