const accountSid;
const authToken;
const client = require("twilio")(accountSid, authToken);

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

module.exports = {
  sendMsg: sendMsg
};
