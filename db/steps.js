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
        sendMsg(msg.From, `Thank you for registering, ${info.name}!`);
        sendMsg(
          msg.From,
          "Please reply 1 to pledge cash, 2 to pledge volunteering, or 3 to pledge both."
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
  let intMsg = Number(msg);
};

module.exports = {
  stepOne,
  stepTwo
};
