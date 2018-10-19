const accountSid = "ACc1141fe39a99e10c7afd363c7c11a936";
const authToken = "9a83f71db175beff8848856ad13e971a";
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
