const db = require("better-sqlite3")(__dirname + "/airports.db")
db.prepare("CREATE TABLE airports (code TEXT, name TEXT, location TEXT, PRIMARY KEY(code));").run()
db.prepare("CREATE TABLE aeroplanes (serialNum TEXT, model TEXT, flightRef TEXT, locationID INTEGER, PRIMARY KEY(serialNum));").run()
db.prepare("CREATE TABLE passengers (passportNum INTEGER, familyName TEXT, givenName TEXT, ticketRef TEXT, locationID INTEGER, PRIMARY KEY(passportNum));").run()