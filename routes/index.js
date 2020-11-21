var express = require('express');
var router = express.Router();

const product = require('./product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// some api
router.get("/api/products", function(req, res, next) {
 return product.list(req.query)
   .then(data => {
       console.log(data);
       res.send(data);
   });
})

module.exports = router;
