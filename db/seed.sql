-- DROP DATABASE IF EXISTS t2p;
-- CREATE DATABASE t2p;
--
-- \c t2p;

DROP TABLE IF EXISTS sms_donors CASCADE;
CREATE TABLE sms_donors (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR UNIQUE,
  name VARCHAR,
  email VARCHAR,
  steps INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS sms_donor_messages;
CREATE TABLE sms_donor_messages (
  id SERIAL PRIMARY KEY,
  message TEXT,
  sms_sid VARCHAR,
  account_sid VARCHAR,
  sms_message_sid VARCHAR,
  message_sid VARCHAR,
  sms_donor_id INTEGER REFERENCES sms_donors,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS sms_pledges;
CREATE TABLE sms_pledges (
  id SERIAL PRIMARY KEY,
  sms_donor_id INTEGER REFERENCES sms_donors,
  message TEXT,
  message_present BOOLEAN,
  payment VARCHAR,
  amount FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
