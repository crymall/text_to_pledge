const db = require("./db_info");
const steps = require("./steps");
const db_actions = require("./db_actions");
const msg_actions = require("./msg_actions");

// ROUTING FUNCTIONS

// handleResponse contains all of the routing logic for responding to donors' messages.
const handleResponse = (req, res, next) => {
  // check if donor exists
  db_actions
    .donor_exists(req.body.From)
    .then(donor => {
      if (donor) {
        // insert text into db
        db_actions.add_msg(req.body, donor).then(() => {
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
            case 3:
              steps.stepFour(req.body);
              break;
            default:
              console.log(err);
              break;
          }
          res.status(200).send({ status: "OK" });
        });
      } else {
        // if they don't already exist in db, create them
        db_actions.create_donor(req.body);
        res.status(200).send({ status: "OK" });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = {
  handleResponse
};
