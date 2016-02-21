var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/leapin-lizards', function(req, res, next) {
  res.render('leap', {
    pageTitle: 'Leapin\' Lizards'
  });
});

router.get('/verizon', function(req, res, next) {
    res.render('verizon', {
        pageTitle: 'Super Bowl City'
    });
});

module.exports = router;
