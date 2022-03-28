const express = require("express")
const router = express.Router()
const Airport = require("../../sources/Airport")
function helper(obj){
    for(let key in obj){
        if(obj[key] instanceof Map){
            obj[key] = Object.fromEntries(obj[key])
        }
    }
    return obj
}
router.get("/", async (req, res)=>{
    let iteratorObject = Airport.all.values()
    let returnArr = []
    for(let x of iteratorObject){
        x = helper(x)
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
    let id = parseInt(req.params.id)
    let result = Airport.all.get(id)
    if(result){
        convRes = helper(result)
        res.send(convRes)
    }
    else{
        res.sendStatus(404)
    }        
})
router.delete("/:id", async (req, res)=>{
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
router.post("/:id/checkIn", async (req, res)=>{
    let id = parseInt(req.params.id)
    let { passportNum, familyName, givenName, ticketRef } = req.body
    let airportObject = Airport.all.get(id)
    await airportObject.checkIn(passportNum, familyName, givenName, ticketRef)
    res.sendStatus(201)
})
router.post("/:id/registerPlane", async (req, res)=>{
    let id = parseInt(req.params.id)
    let { serialNum, model, flightRef } = req.body
    let airportObject = Airport.all.get(id)
    await airportObject.addNewPlane(serialNum, model, flightRef)
    res.sendStatus(201)
})
module.exports = router