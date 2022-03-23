const express = require("express")
const router = express.Router()
const Aeroplane = require("../../sources/Aeroplane")
const Airport = require("../../sources/Airport")

router.get("/", async (req, res)=>{
    let returnArr = []
    let itrObj = Aeroplane.all.values()
    for(let x of itrObj){
        returnArr.push(x)
    }
    res.send(returnArr)
})
router.get("/:id?", async (req, res)=>{ //this is returning the array from just standard get, I've done something wrong here
    let id = parseInt(req.query.id)
    let result = Aeroplane.all.get(id)
    if(result){
        res.send(result)
    }else{
        res.sendStatus(404)
    }

})
router.delete("/", async (req, res)=>{
    let id = parseInt(req.query.id)
    let result = Aeroplane.reqOne(id)
    if(result){
        Aeroplane.all.delete(id)
        Aeroplane.dbDelete.run(id)
        res.sendStatus(204)
    }else{
        res.sendStatus(404)
    }
})
router.patch("/land/:id?", async (req, res)=>{
    let id = parseInt(req.query.id)
    let { landingLocationID } = req.body
    let airportObject = Airport.all.get(landingLocationID)
    let aeroplaneObject = Aeroplane.all.get(id)
    await aeroplaneObject.land(airportObject.acceptPlane.bind(airportObject))
    res.sendStatus(201)
})
router.patch("/land/:id?", async (req, res)=>{
    let id = parseInt(req.query.id)
    let aeroplaneObject = Aeroplane.all.get(id)
    let airportObject = Airport.all.get(aeroplaneObject.locationID)
    await aeroplaneObject.takeoff(airportObject.acceptTakeoff.bind(airportObject))
    res.sendStatus(201)
})
router.patch("/disembark/:id?", async (req, res)=>{
    let id = parseInt(req.query.id)
    let aeroplaneObject = Aeroplane.all.get(id)
    let airportObject = Airport.all.get(aeroplaneObject.locationID)
    await aeroplaneObject.disembarkPassengers(airportObject.acceptPassengers.bind(airportObject))
    res.sendStatus(201)
})
module.exports = router