const db = require("./db_info");
const accountSid = "ACc1141fe39a99e10c7afd363c7c11a936";
const authToken = "9a83f71db175beff8848856ad13e971a";
const client = require("twilio")(accountSid, authToken);

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

const donor_exists = phone => {
  return db
    .any("SELECT * FROM sms_donors WHERE phone_number = ${phone}", {
      phone: phone
    })
    .then(res => {
      return res[0];
    })
    .catch(err => {
      console.log(err);
      return false;
    });
};

const create_donor = user => {
  db.none(
    "INSERT INTO sms_donors (phone_number, steps) VALUES (${From}, 0)",
    user
  )
    .then(res => {
      sendMsg(
        user.From,
        "Hey there! Please reply with your first name, last name, and email address, in that order."
      );
    })
    .catch(err => {
      sendMsg(user.From, "Sorry, something went wrong. Please try again.");
    });
};

const stepOne = msg => {
  let splitMsg = msg.Body.split(" ");
  console.log(splitMsg);
  if (splitMsg.length === 3) {
    let info = {
      name: splitMsg.slice(0, 2).join(" "),
      email: splitMsg[2],
      phone: msg.From
    };
    db.any(
      "UPDATE sms_donors SET name = ${name}, email = ${email}, steps = 1 WHERE phone_number = ${phone}",
      info
    )
      .then(res => {
        sendMsg(msg.From, `Thank you for registering, ${info.name}!`);
      })
      .catch(err => {
        sendMsg(
          msg.From,
          "Sorry, something went wrong. Did you already register with us?"
        );
        console.log("Error updating user: " + err);
      });
  } else {
    sendMsg(
      msg.From,
      "Sorry, something went wrong. Please make sure to reply with your first name, last name, and email, separated by spaces."
    );
  }
};

// ROUTING FUNCTIONS

const sendResponse = (req, res, next) => {
  donor_exists(req.body.From).then(donor => {
    if (donor) {
      switch (donor.steps) {
        case 0:
          stepOne(req.body);
          break;
      }
      res.status(200).send({ status: "OK" });
    } else {
      create_donor(req.body);
      res.status(200).send({ status: "OK" });
    }
  });
};

module.exports = {
  sendResponse
};
