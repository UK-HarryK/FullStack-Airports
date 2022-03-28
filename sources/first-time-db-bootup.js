const db = require("better-sqlite3")(__dirname + "/airports.db")
db.prepare("CREATE TABLE airports (code TEXT PRIMARY KEY, name TEXT, location TEXT);").run()
db.prepare("CREATE TABLE aeroplanes (serialNum TEXT PRIMARY KEY, model TEXT, flightRef TEXT, locationID INTEGER);").run()
db.prepare("CREATE TABLE passengers (passportNum INTEGER PRIMARY KEY, familyName TEXT, givenName TEXT, ticketRef TEXT, locationID INTEGER);").run()