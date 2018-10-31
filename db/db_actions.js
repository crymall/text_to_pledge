const db = require("./db_info");
const msg_actions = require("./msg_actions");

const donorExists = phone => {
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

const createDonor = async user => {
  const user_inserted = await db
    .none(
      "INSERT INTO sms_donors (phone_number, steps) VALUES (${From}, 0)",
      user
    )
    .catch(err => {
      msg_actions.sendMsg(
        user.From,
        "Sorry, we were unable to create your user profile. Please try again with the same dollar amount."
      );
    });

  return user_inserted;
};

const addMsg = (body, donor) => {
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

const addPledge = async body => {
  const donor = await db
    .one("SELECT * FROM sms_donors WHERE phone_number = ${phone}", {
      phone: body.From
    })
    .catch(() => {
      msg_actions.sendMsg(
        body.From,
        "Sorry, something went wrong. Please wait a minute, then try again."
      );
    });

  const insertPledge = await db
    .none(
      "INSERT INTO sms_pledges(sms_donor_id, message_present, payment, amount) VALUES (${donor}, false, ${raw}, ${amount})",
      {
        donor: Number(donor.id),
        raw: body.Body,
        amount: parseFloat(Number(body.Body.replace(/[^0-9.-]+/g, "")))
      }
    )
    .catch(err => {
      console.log(err);
    });

  return insertPledge;
};

const updatePledge = async body => {
  const donor = await db
    .one("SELECT * FROM sms_donors WHERE phone_number = ${phone}", {
      phone: body.From
    })
    .catch(err => {
      console.log(err);
    });

  const pledge = await db
    .one(
      "SELECT * FROM sms_pledges WHERE sms_donor_id = ${id} ORDER BY created_at DESC LIMIT 1",
      {
        id: donor.id
      }
    )
    .catch(err => {
      console.log(err);
    });

  if (body.Body.toLowerCase() === "no" || body.Body.toLowerCase() === "no.") {
    const updatePledge = db
      .any("UPDATE sms_pledges SET message_present = true WHERE id = ${id}", {
        msg: body.Body,
        id: pledge.id
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    const updatePledge = db
      .any(
        "UPDATE sms_pledges SET message = ${msg}, message_present = true WHERE id = ${id}",
        {
          msg: body.Body,
          id: pledge.id
        }
      )
      .catch(err => {
        console.log(err);
      });
  }

  return updatePledge;
};

const getTotalAmount = async () => {
  const totalPledges = await db.one("SELECT SUM(amount) FROM sms_pledges");
  return totalPledges;
};

const getTotalPeople = async () => {
  const totalDonors = await db.one("SELECT COUNT(id) FROM sms_donors");
  return totalPledges;
};

const getAllPledges = async () => {
  const allPledges = await db.any(
    "SELECT * FROM sms_pledges JOIN sms_donors ON sms_pledges.sms_donor_id = sms_donors.id WHERE sms_donors.name IS NOT NULL AND message_present = true"
  );
  return allPledges;
};

module.exports = {
  donorExists,
  createDonor,
  addMsg,
  addPledge,
  updatePledge,
  getTotalAmount,
  getTotalPeople,
  getAllPledges
};
