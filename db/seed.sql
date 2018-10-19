DROP DATABASE IF EXISTS t2p;
CREATE DATABASE t2p;

\c t2p;

CREATE TABLE sms_donors (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR,
  name VARCHAR,
  email VARCHAR,
  steps INTEGER,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE sms_donor_messages (
  id SERIAL PRIMARY KEY,
  message TEXT,
  sms_sid VARCHAR,
  account_sid VARCHAR,
  sms_message_sid VARCHAR,
  message_sid VARCHAR,
  sms_donor_id INTEGER REFERENCES sms_donors,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE sms_pledges (
  id SERIAL PRIMARY KEY,
  sms_donor_id INTEGER REFERENCES sms_donors,
  message TEXT,
  message_present BOOLEAN,
  payment VARCHAR,
  amount FLOAT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
