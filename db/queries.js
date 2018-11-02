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
    db_actions.addMsg(req.body, donorExists).then(() => {
      // take them through process of pledging
      switch (donorExists.steps) {
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
    if (parseFloat(Number(req.body.Body.replace(/[^0-9.-]+/g, "")))) {
      let created = await db_actions.createDonor(req.body);
      let added = await db_actions.addPledge(req.body);
      msg_actions.sendMsg(
        req.body.From,
        "Thank you for your generous pledge in support of Pursuit's mission. What's your full name? (In this format: Firstname Lastname)"
      );
    } else {
      msg_actions.sendMsg(
        req.body.From,
        "Sorry, something went wrong. Please make sure you enter a valid pledge amount."
      );
    }
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

const handleTotalPledges = (req, res, next) => {
  db_actions.getTotalPledgeCount().then(total => {
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

const sendBlast = async (req, res, next) => {
  const numbers = await db.any("SELECT phone_number FROM sms_donors");
  console.log("NUMBERS ", numbers);
  numbers.forEach(num => {
    msg_actions.sendMsg(
      num.phone_number,
      "Thank you so much for joining us at the Pursuit Bash. To learn more about how to volunteer, hire a Fellow, or get involved with leadership opportunities, visit http://bit.ly/pursuitbash"
    );
  });

  res.status(200).send({
    status: "OK"
  });
};

const getAllPledges = (req, res, next) => {
  db_actions.getAllPledgers().then(pledgers => {
    res.status(200).send({
      pledgers: pledgers
    });
  });
};

module.exports = {
  handleResponse,
  handleTotal,
  handleTotalPledges,
  handlePledges,
  sendBlast
};
