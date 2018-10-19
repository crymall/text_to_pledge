var express = require("express");
let db = require("../db/queries");
var router = express.Router();

/* GET home page. */
router.get("/", db.sendResponse);

module.exports = router;
