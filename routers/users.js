const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require(path.resolve('./database/authentication'));


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

router.post('/user/logout', (req, res) => {
  controller.logout(req, res);
})

module.exports = router;