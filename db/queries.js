const db = require("./db_info");
const accountSid = "ACc1141fe39a99e10c7afd363c7c11a936";
const authToken = "9a83f71db175beff8848856ad13e971a";
const client = require("twilio")(accountSid, authToken);

// HELPER FUNCTIONS

const donor_exists = phone => {
  let user;

  db.one("SELECT * FROM sms_donors WHERE phone_number = ${phone}", {
    phone: phone
  })
    .then(res => {
      user = res;
    })
    .catch(err => {
      user = false;
    });

  return user;
};

// const create_donor = user => {
//   db.none(
//     "INSERT INTO sms_donors (phone_number, name, email, steps, created_at, updated_at) VALUES (${From, })"
//   );
// };

// ROUTING FUNCTIONS

const sendResponse = (req, res, next) => {
  if (donor_exists(req.body.From)) {
    console.log("exists!");
    res.status(200).send({ status: "OK" });
  } else {
    console.log("does not exist!");

    res.status(200).send({ status: "OK" });
  }
};

module.exports = {
  sendResponse
};
