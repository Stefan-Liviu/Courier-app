const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require(path.resolve('./database/controller'));


router.post('/user/register', (req, res) => { 
  controller.createTabel()
  controller.register(req, res);  
});

router.get('/user/login', (req, res) => {
  res.render('login');
})

router.post('/user/login', (req, res) => {
   controller.login(req, res);
})

router.get('/user/register', (req, res) => {
  res.render('register');
})

router.get('/user/newRoute', (req, res) => {  
  controller.newRoute(req, res);
})

router.get('/user/account', (req, res) => {
  controller.profile(req, res);
})

router.get('/user/logout', (req, res) => {
  controller.logout(req, res)
})
module.exports = router;