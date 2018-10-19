const db = require("./db_info");
const steps = require("./steps");
const db_actions = require("./db_actions");
const msg_actions = require("./msg_actions");

// HELPER FUNCTIONS

const sendMsg = (to, body) => {
  client.messages.create(
    {
      to: to,
      from: "+13475274222",
      body: body
    },
    (err, message) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

// ROUTING FUNCTIONS

const sendResponse = (req, res, next) => {
  // check if donor exists
  donor_exists(req.body.From)
    .then(donor => {
      if (donor) {
        // insert text into db
        db.none(
          "INSERT INTO sms_donor_messages(message, sms_sid, account_sid, sms_donor_id) VALUES (${message}, ${sms_id}, ${acct_id}, ${donor_id})",
          {
            message: req.body.Body,
            sms_id: req.body.SmsSid,
            acct_id: req.body.AccountSid,
            donor_id: donor.id
          }
        ).then(() => {
          // take them through process of pledging
          switch (donor.steps) {
            case 0:
              steps.stepOne(req.body);
              break;
            case 1:
              steps.stepTwo(req.body);
              break;
          }
          res.status(200).send({ status: "OK" });
        });
      } else {
        // if they don't already exist in db, create them
        create_donor(req.body);
        res.status(200).send({ status: "OK" });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = {
  sendResponse
};
