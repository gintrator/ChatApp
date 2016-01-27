var express = require('express');
var server = require('../server')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('chat', {});
});

router.post('/', function(req, res, next) {
  res.render('chat', {chatname: req.body.chatname});
});

router.get('/chat', function(req, res, next) {
    res.render('chat', {});
});

module.exports = router;
