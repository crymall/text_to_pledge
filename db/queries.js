const db = require("./db_info");
const steps = require("./steps");
const db_actions = require("./db_actions");
const msg_actions = require("./msg_actions");
const badWords = require("./badwords");

// ROUTING FUNCTIONS

// handleResponse contains all of the routing logic for responding to donors' messages.
const handleResponse = async (req, res, next) => {
  let message = req.body.Body;
  let splitMsg = message.split(" ").filter(el => {
    return el;
  });
  let noBadWords = splitMsg.every(el => {
    return !badWords[el.toLowerCase()] && el.length < 30;
  });

  let donorExists = await db_actions.donorExists(req.body.From);

  // check if donor exists
  if (noBadWords && message.length < 140 && donorExists) {
    // insert text into db
    db_actions.addMsg(req.body, donorExists[0]).then(() => {
      // take them through process of pledging
      switch (donor.steps) {
        case 0:
          steps.stepOne(req.body);
          break;
        case 1:
          steps.stepTwo(req.body);
          break;
        case 2:
          steps.stepThree(req.body);
          break;
        default:
          console.log(err);
          break;
      }
      res.status(200).send({ status: "OK" });
    });
  } else {
    // if they don't already exist in db, create them
    let created = await db_actions.createDonor(req.body);
    let added = await db_actions.addPledge(req.body);
    msg_actions.sendMsg(
      req.body.From,
      "Thank you for your generous pledge in support of Pursuit's mission. What's your full name? (In this format: Firstname Lastname)"
    );
    res.status(200).send({ status: "OK" });
  }
};

// FRONTEND FUNCTIONS

const handleTotal = (req, res, next) => {
  db_actions.getTotalAmount().then(total => {
    res.status(200).send({
      status: "OK",
      total: total
    });
  });
};

const handlePledges = (req, res, next) => {
  db_actions.getAllPledges().then(pledges => {
    res.status(200).send({
      status: "OK",
      pledges: pledges
    });
  });
};

module.exports = {
  handleResponse,
  handleTotal,
  handlePledges
};
