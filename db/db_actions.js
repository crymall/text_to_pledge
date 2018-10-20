const db = require("./db_info");
const msg_actions = require("./msg_actions");

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
  return db.none(
    "INSERT INTO sms_donor_messages(message, sms_sid, account_sid, sms_donor_id) VALUES (${message}, ${sms_id}, ${acct_id}, ${donor_id})",
    {
      message: body.Body,
      sms_id: body.SmsSid,
      acct_id: body.AccountSid,
      donor_id: donor.id
    }
  );
};

const add_pledge = body => {
  return db
    .one("SELECT * FROM sms_donors WHERE phone_number = ${phone}", {
      phone: body.From
    })
    .then(donor => {
      db.none(
        "INSERT INTO sms_pledges(sms_donor_id, message_present, payment, amount) VALUES (${donor}, false, ${raw}, ${amount})",
        {
          donor: Number(donor.id),
          raw: body.Body,
          amount: parseFloat(Number(body.Body.replace(/[^0-9.-]+/g, "")))
        }
      ).catch(err => {
        console.log(err);
      });
    })
    .catch(() => {
      msg_actions.sendMsg(
        body.From,
        "Sorry, something went wrong. Please try again."
      );
    });
};

module.exports = {
  donor_exists,
  create_donor,
  add_msg,
  add_pledge
};
