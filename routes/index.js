var express = require("express");
let db = require("../db/queries");
var router = express.Router();

/* GET home page. */
router.post("/text", db.handleResponse);
router.get("/total", db.handleTotal);
router.get("/pledges", db.handlePledges);

module.exports = router;
