module.exports = class Aeroplane{
    static dbConnection = require("better-sqlite3")("../server/airports.db")
    static selectAll = Aeroplane.dbConnection.prepare("SELECT * FROM aeroplanes;")
    static dbInsert = Aeroplane.dbConnection.prepare("INSERT OR IGNORE INTO aeroplanes (serialNum, model, flightRef, locationID) VALUES (?, ?, ?, ?);")
    static dbDelete = Aeroplane.dbConnection.prepare("DELETE FROM aeroplanes WHERE rowid = ?;")
    static dbUpdateLocation = Aeroplane.dbConnection.prepare("UPDATE aeroplanes SET locationID = ? WHERE serialNum = ?;")
    static all = new Map()
    static reqOne = (id)=>{return Aeroplane.all.get(id)}
    constructor(serialNum, model, flightRef, locationID){
        this.serialNum = serialNum
        this.model = model
        this.flightRef = flightRef
        this.locationID = locationID
        Aeroplane.dbInsert.run(this.serialNum, this.model, this.flightRef, this.locationID)
        this.dbID = Aeroplane.dbConnection.prepare("SELECT rowid FROM aeroplanes WHERE serialNum = ?;").get(this.serialNum).rowid
        this.passengers = new Map()
        Aeroplane.all.set(this.dbID, this)
        console.log(this)
    }
    async land(portAcceptLandCB){
        try{        
            portAcceptLandCB(this)
            Aeroplane.dbUpdateLocation.run(this.locationID, this.serialNum)
            return true
        }
        catch(error){
            console.trace(error)
            return false
        }
    }
    async takeoff(portTakeoffCB){
        try{
            portTakeoffCB(this)
            Aeroplane.dbUpdateLocation.run(0, this.serialNum)
            return true
        }
        catch(error){
            console.trace(error)
            return false
        }
    }
    async acceptPassenger(flyer){
        try{
            this.passengers.add(flyer)
            return true
        }
        catch(error){
            console.trace(error)
            return false
        }
    }
    async disembarkPassengers(portDisembarkCB){
        try{
            await portDisembarkCB(this.passengers)
            this.passengers = new Map()
            return true
        }
        catch(error){
            console.trace(error)
            return false
        }
    }
}

