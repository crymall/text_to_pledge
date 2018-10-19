const db = require("./db_info");
const msg_actions = require("./msg_actions");

const donor_exists = phone => {
  console.log("yep, we got here...");
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
      msg_actions.sendMsg(
        user.From,
        "Hey there! Please reply with your name and email address, without punctuation, in this format: FirstName LastName email@email.com"
      );
    })
    .catch(err => {
      msg_actions.sendMsg(
        user.From,
        "Sorry, something went wrong. Please try again."
      );
    });
};

const add_msg = (body, donor) => {
  db.none(
    "INSERT INTO sms_donor_messages(message, sms_sid, account_sid, sms_donor_id) VALUES (${message}, ${sms_id}, ${acct_id}, ${donor_id})",
    {
      message: body.Body,
      sms_id: body.SmsSid,
      acct_id: body.AccountSid,
      donor_id: donor.id
    }
  );
};

module.exports = {
  donor_exists,
  create_donor,
  add_msg
};
