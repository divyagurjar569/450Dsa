var express = require('express');
var router = express.Router();
var userModel= require("./users");
var question = require("./question")
const passport=require('passport');
var localStrategy=require('passport-local');

passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/admin', function(req, res, next) {
  res.render('admin', { title: 'Express' });
});

router.post('/done', function(req, res, next) {
  var data=new question({
    category:req.body.category,
    question:req.body.question,
    notes:req.body.notes,
    link:req.body.link
  })
  data.save().then( item => {
    res.send("saved to database");
  }).catch(err => {
    res.status(400).send("unable to save");
  });
});

router.get('/profile',isLoggedIn, function(req, res, next) {
  const user=req.session.passport.user;
 userModel.findOne({username:req.session.passport.user})
 .then(function(foundUser){
   res.render('profile',{user:foundUser})
 });
 });

 router.get('/q2',function(req,res,next){
  question.find({category:"array"}).then(function(found){
    console.log(found);
  })
 })

router.post('/register',function(req,res){
 var newUser=new userModel({
     username:req.body.username,
     email:req.body.email,
     number:req.body.number
   })
   userModel.register(newUser,req.body.password)
   .then(function(){
     passport.authenticate('local')(req,res,function(){ //why local is written here
       res.redirect('/profile')
     })
   })
   .catch(function(val){
     res.send(val)
   })
 });

router.post('/login',passport.authenticate('local',{
   successRedirect:'/profile',
   failureRedirect:'/'
 }),function(req,res){});

router.get('/logout',function(req,res,next){
   req.logout(function(err)
   {
     if(err){
       return next(err);
     }
     res.redirect('/');
   });
 });

 function isLoggedIn(req,res,next){
   if(req.isAuthenticated())
     return next();
   else
     res.redirect('/');
 }

 router.get('/question',isLoggedIn,async function(req,res,next){
  var users = await userModel.find({});
  res.send(users)
 })
 
module.exports = router;

