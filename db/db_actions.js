const db = require("./db_info");

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
        "Hey there! Please reply with your name and email address, without punctuation, in this format: FirstName LastName email@email.com"
      );
    })
    .catch(err => {
      sendMsg(user.From, "Sorry, something went wrong. Please try again.");
    });
};

module.exports = {
  donor_exists,
  create_donor
};
