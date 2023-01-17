const express = require('express');
const router = express.Router();
const ortrangController = require("../controllers/ortrangController")


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.post("/", ortrangController.index);

module.exports = router;
