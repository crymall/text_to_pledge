const msg_actions = require("./msg_actions");
const db_actions = require("./db_actions");
const db = require("./db_info");

const validateEmail = email => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// PRIMARY ROUTING ACTIONS

const stepOne = msg => {
  let splitMsg = msg.Body.split(" ").filter(el => {
    return el;
  });
  // message format: "FirstName LastName email@email.com" =>
  // splitMsg: [FirstName, LastName, email@email.com]
  if (splitMsg.length === 2 || splitMsg.length === 3) {
    let info = {
      name: splitMsg.join(" "),
      phone: msg.From
    };
    db.any(
      "UPDATE sms_donors SET name = ${name}, steps = 1 WHERE phone_number = ${phone}",
      info
    )
      .then(res => {
        msg_actions.sendMsg(
          msg.From,
          "And your email address? (Format: email@email.com)"
        );
      })
      .catch(err => {
        msg_actions.sendMsg(msg.From, "Sorry, something went wrong.");
        console.log("Error updating user: " + err);
      });
  } else {
    msg_actions.sendMsg(
      msg.From,
      "Sorry, something went wrong. Please make sure to reply with your first name and last name, separated by spaces."
    );
  }
};

const stepTwo = async msg => {
  const donor = await db_actions.donorExists(msg.From);

  if (donor.email) {
    if (parseFloat(Number(msg.Body.replace(/[^0-9.-]+/g, "")))) {
      const pledge = await db_actions.addPledge(msg);

      db.any("UPDATE sms_donors SET steps = 2 WHERE phone_number = ${phone}", {
        phone: msg.From
      })
        .then(() => {
          msg_actions.sendMsg(
            msg.From,
            "What inspired you tonight? This response will be displayed to the audience. If you don't want to include a message with your pledge, please reply 'no'."
          );
        })
        .catch(() => {
          msg_actions.sendMsg(
            msg.From,
            "Sorry, something went wrong. Please try again."
          );
        });
    } else {
      msg_actions.sendMsg(
        msg.From,
        "Sorry, something went wrong. Please make sure you enter a valid pledge amount."
      );
    }
  } else {
    let test = validateEmail(msg.Body);

    if (test) {
      db.any(
        "UPDATE sms_donors SET steps = 2, email = ${email} WHERE phone_number = ${phone}",
        {
          phone: msg.From,
          email: msg.Body
        }
      )
        .then(() => {
          msg_actions.sendMsg(
            msg.From,
            "What inspired you tonight? This response will be displayed to the audience. If you don't want to include a message with your pledge, please reply 'no'."
          );
        })
        .catch(() => {
          msg_actions.sendMsg(
            msg.From,
            "Sorry, something went wrong. Please try again."
          );
        });
    } else {
      msg_actions.sendMsg(msg.From, "Please reply with a valid email.");
    }
  }
};

const stepThree = async msg => {
  if (msg.Body.toLowerCase() === "no") {
    db.none(
      "UPDATE sms_donors SET steps = 1, message_present = true WHERE phone_number = ${phone}",
      {
        phone: msg.From
      }
    )
      .then(() => {
        msg_actions.sendMsg(
          msg.From,
          "Thanks again for your pledge. If you would like to make an additional pledge, please reply with the amount of your additional pledge."
        );
      })
      .catch(() => {
        msg_actions.sendMsg(
          msg.From,
          "Sorry, something went wrong. Please try again."
        );
      });
  } else {
    const pledge_updated = await db_actions.updatePledge(msg).catch(() => {
      msg_actions.sendMsg(
        msg.From,
        "Sorry, something went wrong. Please try again."
      );
    });

    const update_donor = await db
      .none("UPDATE sms_donors SET steps = 1 WHERE phone_number = ${phone}", {
        phone: msg.From
      })
      .then(() => {
        msg_actions.sendMsg(
          msg.From,
          "Thanks again for your pledge. If you would like to make an additional pledge, please reply with the amount of your additional pledge."
        );
      })
      .catch(() => {
        msg_actions.sendMsg(
          msg.From,
          "Sorry, something went wrong. Please try again."
        );
      });
  }
};

module.exports = {
  stepOne,
  stepTwo,
  stepThree
};

// const stepTwo = msg => {
//   const intMsg = Number(msg.Body);
//   console.log("STEP TWO intMsg: ", msg.Body);
//   switch (intMsg) {
//     case 1:
//       handleDonation(msg);
//       break;
//     case 2:
//       handleVolunteering(msg);
//       break;
//     case 3:
//       handleBoth(msg);
//       break;
//     default:
//       msg_actions.sendMsg(msg.From, "Sorry, please input a valid number.");
//       break;
//   }
// };

// const handleVolunteering = msg => {
//   db.any(
//     "UPDATE sms_donors SET steps = 1, volunteer = true WHERE phone_number = ${phone}",
//     {
//       phone: msg.From
//     }
//   )
//     .then(() => {
//       msg_actions.sendMsg(
//         msg.From,
//         "Thanks for offering to volunteer! We'll be in touch. If you'd like to pledge money later, please reply with 1."
//       );
//     })
//     .catch(() => {
//       msg_actions.sendMsg(
//         msg.From,
//         "Sorry, something went wrong. Please try again."
//       );
//     });
// };

// const handleBoth = msg => {
//   db.any(
//     "UPDATE sms_donors SET steps = 2, volunteer = true WHERE phone_number = ${phone}",
//     {
//       phone: msg.From
//     }
//   )
//     .then(() => {
//       msg_actions.sendMsg(
//         msg.From,
//         "Thanks for volunteering and pledging! We'll be in touch. Please reply with the amount you'd like to pledge."
//       );
//     })
//     .catch(() => {
//       msg_actions.sendMsg(
//         msg.From,
//         "Sorry, something went wrong. Please try again."
//       );
//     });
// };
