const express = require("express")
const router = express.Router()
const Airport = require("../../sources/Airport")
router.get("/airports", (req, res)=>{
    res.send(Airport.all)
})
router.post("/airports", (req, res)=>{
    let {code, name, location} = req.body
    res.status(201).send(new Airport(code, name, location))
})
router.get("/airports:id", (req, res)=>{
    let id = req.params.id
    let result = Airport.reqOne(id)
    if(result){
        res.send(result)
    }
    else{
        res.sendStatus(404)
    }        
})
router.delete("/airports", (req, res)=>{
    let id = req.params.id
    let result = Airport.reqOne(id)
    if(result){
        Airport.dbDelete.run(id)
        Airport.all.delete(id)
        res.sendStatus(204)
    }
    else{
        res.sendStatus(404)
    }
})
router.post("/aiports:id/checkIn", async (req, res)=>{
    let id = req.params.id
    let { passportNum, familyName, givenName, ticketRef } = req.body
    let aiportObject = Airport.all.get(id)
    await aiportObject.checkIn(passportNum, familyName, givenName, ticketRef)
    res.sendStatus(201)
})
router.post("/airports:id/registerPlane", async (req, res)=>{
    let id = req.params.id
    let { serialNum, model, flightRef } = req.body
    let aiportObject = Airport.all.get(id)
    await aiportObject.addNewPlane(serialNum, model, flightRef)
    res.sendStatus(201)
})
module.exports = router