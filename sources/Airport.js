const Aeroplane = require("./Aeroplane")
const Passenger = require("./Passenger")
module.exports = class Airport{
    static dbConnection = require("better-sqlite3")("../server/airports.db")
    static selectAll = Airport.dbConnection.prepare("SELECT * FROM airports")
    static dbInsert = Airport.dbConnection.prepare("INSERT OR IGNORE INTO airports (code, name, location) VALUES (?, ?, ?);")
    static dbDelete = Airport.dbConnection.prepare("DELETE FROM airports WHERE rowid = ?;")
    static all = new Map()
    static reqOne = (id)=>{return Airport.all.get[id]}
    static bootUp = ()=>{                                                       //This function is weird. I think it will work but i don't like it, feels wrong and slow 
        let allPorts = Airport.selectAll.all()
        let allPlanes = Aeroplane.selectAll.all()
        let allFlyers = Passenger.selectAll.all()
        for(let portRow of allPorts){
            let airport = new Airport(portRow.code, portRow.name, portRow.location)
            for(let planeRow of allPlanes){
                if(planeRow.locationID == airport.dbID){
                    airport.addNewPlane(planeRow.serialNum, planeRow.model, planeRow.flightRef) 
                }
            }
            for(let flyerRow of allFlyers){
                if(flyerRow.locationID == airport.dbID){
                    airport.checkIn(flyerRow.passportNum, flyerRow.givenName, flyerRow.familyName, flyerRow.ticketRef)
                }
            }
        }
        for(let planeRow of allPlanes){             //\this is inflight, DOESNT need to be bound to airport
            if(planeRow.locationID == 0){
                for(let flyerRow of allFlyers){
                    if(flyerRow.locationID == 0 && flyerRow.ticketRef == planeRow.flightRef){
                        let plane = new Aeroplane(planeRow.serialNum, planeRow.model, planeRow.flightRef, 0)
                        let flyer = new Passenger(flyerRow.passportNum, flyerRow.familyName, flyerRow.givenName, flyerRow.ticketCode, flyerRow.locationID)
                        //not happy with this, unused variable, seems memory inefficient, ask for advice Monday morning
                    }
                }
            }
        }
    }
    constructor(code, name, location){
        this.code = code
        this.name = name
        this.location = location
        Airport.dbInsert.run(this.code, this.name, this.location)
        this.dbID = Airport.dbConnection.prepare("SELECT rowid FROM airports WHERE code = ?;").get(this.code).rowid
        this.aeroplanes = new Set()
        this.checkedInFlyers = new Map()
        Airport.all.set(this.dbID, this)
    }
    async acceptPlane(aeroplane){
        try{        
            this.aeroplanes.add(aeroplane)
            aeroplane.locationID = this.dbID
            return true
        }
        catch(error){
            console.trace(error)
            return false
        }
    }
    async acceptTakeoff(aeroplane){
        try{
            this.aeroplanes.delete(aeroplane)
            return true
        }
        catch(error){
            console.trace(error)
            return false
        }
    }
    async checkIn(passportNum, givenName, familyName, ticketRef){
        try{
            let person = new Passenger(passportNum, familyName, givenName, ticketRef, this.dbID)
            this.checkedInFlyers.set(passportNum, person)
            return person
        }
        catch(error){
            console.trace(error)
            return false
        }
    }
    async flyerBoard(flyer){
        try{
            this.checkedInFlyers.delete(flyer.passportNum)
            return true
        }
        catch(error){
            console.trace(error)
            return false
        }
    }
    async planeDisemabrk(passengers){
        try{
            for(let p of passengers){
                this.checkedInFlyers.set(p.passportNum, p)
                Passenger.dbUpdateLocation.run(this.dbID, p.passportNum)
            }
            return true
        }
        catch(error){
            console.trace(error)
            return false
        }
    }
    async addNewPlane(serialNum, model, flightRef){
        try{
            let returnPlane = new Aeroplane(serialNum, model, flightRef, this.dbID)
            this.aeroplanes.add(returnPlane)
            return returnPlane    
        }
        catch(error){
            console.trace(error)
            return false
        }
    }
}