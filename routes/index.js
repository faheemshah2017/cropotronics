var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('website');
});

router.get('/page/:page',function(req,res,next){
    res.render(req.params.page);
})

module.exports = router;
