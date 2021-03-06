var express = require("express");
let db = require("../db/queries");
var router = express.Router();

/* GET home page. */
router.post("/text", db.handleResponse);
router.get("/blast", db.sendBlast);
router.get("/total", db.handleTotal);
router.get("/pledges", db.handlePledges);
router.get("/pledgecount", db.handleTotalPledges);
router.get("/pledgers", db.getAllPledges);

module.exports = router;
