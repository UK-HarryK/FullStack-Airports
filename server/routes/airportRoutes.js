const express = require("express")
const router = express.Router()
const Airport = require("../../sources/Airport")
router.get("/", async (req, res)=>{
    let iteratorObject = Airport.all.values()
    let returnArr = []
    for(let x of iteratorObject){
        returnArr.push(x)
    }
    res.send(returnArr)
})
router.post("/", async (req, res)=>{
    let {code, name, location} = req.body
    let plane = new Airport(code, name, location)
    res.status(201).send(plane)
})
router.get("/:id", async (req, res)=>{
    let id = parseInt(req.query.id)
    let result = Airport.all.get(id)
    if(result){
        res.send(result)
    }
    else{
        res.sendStatus(404)
    }        
})
router.delete("/?id", async (req, res)=>{
    let id = parseInt(req.query.id)
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
router.patch("/checkIn/?id", async (req, res)=>{
    let id = parseInt(req.query.id)
    let { passportNum, familyName, givenName, ticketRef } = req.body
    let aiportObject = Airport.all.get(id)
    await aiportObject.checkIn(passportNum, familyName, givenName, ticketRef)
    res.sendStatus(201)
})
router.patch("/registerPlane/?id", async (req, res)=>{
    let id = parseInt(req.query.id)
    let { serialNum, model, flightRef } = req.body
    let aiportObject = Airport.all.get(id)
    await aiportObject.addNewPlane(serialNum, model, flightRef)
    res.sendStatus(201)
})
module.exports = router