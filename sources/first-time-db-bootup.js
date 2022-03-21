const db = require("better-sqlite3")(__dirname + "/airports.db")
db.prepare("CREATE TABLE airports (id INTEGER PRIMARY KEY, code TEXT PRIMARY KEY, name TEXT, location TEXT);").run()
db.prepare("CREATE TABLE aeroplanes (id INTEGER PRIMARY KEY, serialNum TEXT PRIMARY KEY, model TEXT, flightRef TEXT, locationID INTEGER);").run()
db.prepare("CREATE TABLE passengers (id INTEGER PRIMARY KEY, passportNum INTEGER PRIMARY KEY, familyName TEXT, givenName TEXT, ticketRef TEXT, locationID INTEGER);").run()