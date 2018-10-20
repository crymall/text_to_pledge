const msg_actions = require("./msg_actions");
const db_actions = require("./db_actions");
const db = require("./db_info");

const stepOne = msg => {
  let splitMsg = msg.Body.split(" ");
  // message format: "FirstName LastName email@email.com" =>
  // splitMsg: [FirstName, LastName, email@email.com]
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
        sendMsg(
          msg.From,
          "Thank you. Please reply 1 to pledge cash, 2 to pledge volunteering, or 3 to pledge both."
        );
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

const stepTwo = msg => {
  const intMsg = Number(msg.Body);
  switch (intMsg) {
    case 1:
      handleDonation(msg);
      break;
    case 2:
      handleVolunteering(msg);
      break;
    case 3:
      handleBoth(msg);
      break;
    default:
      msg_actions.sendMsg(msg.From, "Sorry, please input a valid number.");
      break;
  }
};

const handleDonation = msg => {
  db.any("UPDATE sms_donors SET steps = 2 WHERE phone_number = ${phone}", {
    phone: msg.From
  })
    .then(() => {
      sendMsg(
        msg.From,
        "Thanks for pledging! Please reply with the amount you'd like to pledge."
      );
    })
    .catch(() => {
      sendMsg(msg.From, "Sorry, something went wrong. Please try again.");
    });
};

const handleVolunteering = msg => {
  db.any(
    "UPDATE sms_donors SET steps = 1, volunteer = true WHERE phone_number = ${phone}",
    {
      phone: msg.From
    }
  )
    .then(() => {
      sendMsg(
        msg.From,
        "Thanks for offering to volunteer! We'll be in touch. If you'd like to pledge money later, please reply with 1."
      );
    })
    .catch(() => {
      sendMsg(msg.From, "Sorry, something went wrong. Please try again.");
    });
};

const handleBoth = () => {};

module.exports = {
  stepOne,
  stepTwo
};
