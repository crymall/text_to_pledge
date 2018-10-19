const db = require("./db_info");
const accountSid = "ACc1141fe39a99e10c7afd363c7c11a936";
const authToken = "9a83f71db175beff8848856ad13e971a";
const client = require("twilio")(accountSid, authToken);

const sendResponse = (req, res, next) => {
  console.log(req);
  res.status(200).json({
    message: "OK"
  });
};

module.exports = {
  sendResponse
};
