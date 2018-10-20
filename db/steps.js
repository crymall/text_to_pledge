const msg_actions = require("./msg_actions");
const db_actions = require("./db_actions");
const db = require("./db_info");

// PRIMARY ROUTING ACTIONS

const stepOne = msg => {
  let splitMsg = msg.Body.split(" ");
  // message format: "FirstName LastName email@email.com" =>
  // splitMsg: [FirstName, LastName, email@email.com]
  if (splitMsg.length === 3 || splitMsg.length === 4) {
    let info = {
      name:
        splitMsg.length === 3
          ? splitMsg.slice(0, 2).join(" ")
          : splitMsg.slice(0, 3).join(" "),
      email: splitMsg.length === 3 ? splitMsg[2] : splitMsg[3],
      phone: msg.From
    };
    db.any(
      "UPDATE sms_donors SET name = ${name}, email = ${email}, steps = 1 WHERE phone_number = ${phone}",
      info
    )
      .then(res => {
        msg_actions.sendMsg(
          msg.From,
          "Thank you. Please reply 1 to pledge cash, 2 to pledge volunteering, or 3 to pledge both."
        );
      })
      .catch(err => {
        msg_actions.sendMsg(
          msg.From,
          "Sorry, something went wrong. Did you already register with us?"
        );
        console.log("Error updating user: " + err);
      });
  } else {
    msg_actions.sendMsg(
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

const stepThree = msg => {
  db_actions
    .add_pledge(msg)
    .then(() => {
      db.none("UPDATE sms_donors SET steps = 3 WHERE phone_number = ${phone}", {
        phone: msg.From
      })
        .then(() => {
          msg_actions.sendMsg(
            msg.From,
            "Thank you so much. Would you like to add a public message to this pledge? Please reply 'no' if not, and with your message if so."
          );
        })
        .catch(() => {
          msg_actions.sendMsg(
            msg.From,
            "Sorry, something went wrong. Please try again."
          );
        });
    })
    .catch(() => {
      msg_actions.sendMsg(
        msg.From,
        "Sorry - please make sure to reply with a valid dollar amount."
      );
    });
};

const stepFour = msg => {
  db_actions
    .update_pledge(msg)
    .then(() => {
      db.none("UPDATE sms_donors SET steps = 1 WHERE phone_number = ${phone}", {
        phone: msg.From
      }).then(() => {
        msg_actions.sendMsg(
          msg.From,
          "Thanks so much! Please reply with '1' to donate again."
        );
      });
    })
    .catch(() => {
      msg_actions.sendMsg(
        msg.From,
        "Sorry, something went wrong. Please try again."
      );
    });
};

// HANDLER ACTIONS

const handleDonation = msg => {
  db.any(
    "UPDATE sms_donors SET steps = 2, volunteer = false WHERE phone_number = ${phone}",
    {
      phone: msg.From
    }
  )
    .then(() => {
      msg_actions.sendMsg(
        msg.From,
        "Thanks for pledging! Please reply with the amount you'd like to pledge."
      );
    })
    .catch(() => {
      msg_actions.sendMsg(
        msg.From,
        "Sorry, something went wrong. Please try again."
      );
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
      msg_actions.sendMsg(
        msg.From,
        "Thanks for offering to volunteer! We'll be in touch. If you'd like to pledge money later, please reply with 1."
      );
    })
    .catch(() => {
      msg_actions.sendMsg(
        msg.From,
        "Sorry, something went wrong. Please try again."
      );
    });
};

const handleBoth = msg => {
  db.any(
    "UPDATE sms_donors SET steps = 2, volunteer = true WHERE phone_number = ${phone}",
    {
      phone: msg.From
    }
  )
    .then(() => {
      msg_actions.sendMsg(
        msg.From,
        "Thanks for volunteering and pledging! We'll be in touch. Please reply with the amount you'd like to pledge."
      );
    })
    .catch(() => {
      msg_actions.sendMsg(
        msg.From,
        "Sorry, something went wrong. Please try again."
      );
    });
};

module.exports = {
  stepOne,
  stepTwo,
  stepThree,
  stepFour
};
