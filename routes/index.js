var express = require("express");
let db = require("../db/queries");
var router = express.Router();

/* GET home page. */
router.post("/text", db.handleResponse);

module.exports = router;
