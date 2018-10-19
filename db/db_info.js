var pgp = require("pg-promise")({});
var connectionString = "postgres://localhost/t2p";
var db = pgp(connectionString);

module.exports = db;
