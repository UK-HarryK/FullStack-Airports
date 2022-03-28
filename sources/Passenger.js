const Person = require("./Person")
module.exports = class Passenger extends Person{
    static dbConnection = require("better-sqlite3")("../server/airports.db")
    static selectAll = Passenger.dbConnection.prepare("SELECT * FROM passengers;")
    static dbInsert = Passenger.dbConnection.prepare("INSERT OR IGNORE INTO passengers (passportNum, familyName, givenName, ticketRef, locationID) VALUES (?, ?, ?, ?, ?);")
    static dbDelete = Passenger.dbConnection.prepare("DELETE FROM passengers WHERE passportNum = ?;")
    static dbUpdateLocation = Passenger.dbConnection.prepare("UPDATE passengers SET locationID = ? WHERE passportNum = ?;")
    static all = new Map()
    static reqOne = (id)=>{Passenger.all.get(id)}
    constructor(passportNum, familyName, givenName, ticketCode, locationID){
        super(passportNum, givenName, familyName)
        this.ticketCode = ticketCode
        this.locationID = locationID
        Passenger.dbInsert.run(this.passportNum, this.familyName, this.givenName, this.ticketCode, this.locationID)
        this.dbID = Passenger.dbConnection.prepare("SELECT * FROM passengers WHERE passportNum = ?;").get(this.passportNum).rowid
        Passenger.all.set(this.dbID, this)
    }
    async board(portBoardCB, planeBoardCB){
        try{
            Passenger.dbUpdateLocation.run(0, this.passportNum)
            await Promise.all([planeBoardCB(this), portBoardCB(this)])
            return true
        }
        catch(error){
            console.trace(error)
            return false //handle error? I dunno this wouldn't crash but in practise i guess you would just log and refresh whatever page this is running on? 
        }
    }
}