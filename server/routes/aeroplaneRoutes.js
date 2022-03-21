const express = require("express")
const router = express.Router()
const Aeroplane = require("../../sources/Aeroplane")
const Airport = require("../../sources/Airport")

router.get("/aeroplanes", (req, res)=>{
    res.send(Aeroplane.all)
})
router.get("/aeroplanes:id", (req, res)=>{
    res.send(Aeroplane.reqOne(id))
})
router.delete("/aeroplanes", (req, res)=>{
    let id = req.params.id
    let result = Aeroplane.reqOne(id)
    if(result){
        Aeroplane.all.delete(id)
        Aeroplane.dbDelete.run(id)
        res.sendStatus(204)
    }else{
        res.sendStatus(404)
    }
})
router.post("/aeroplanes:id/land", async (req, res)=>{
    let id = req.params.id
    let { landingLocationID } = req.body
    let airportObject = Airport.all.get(landingLocationID)
    let aeroplaneObject = Aeroplane.all.get(id)
    await aeroplaneObject.land(airportObject.acceptPlane.bind(airportObject))
    res.sendStatus(201)
})
router.post("/aeroplanes:id/takeoff", async (req, res)=>{
    let id = req.params.id
    let aeroplaneObject = Aeroplane.all.get(id)
    let airportObject = Airport.all.get(aeroplaneObject.locationID)
    await aeroplaneObject.takeoff(airportObject.acceptTakeoff.bind(airportObject))
    res.sendStatus(201)
})
router.post("/aeroplanes:id/disembark", async (req, res)=>{
    let id = req.params.id
    let aeroplaneObject = Aeroplane.all.get(id)
    let airportObject = Airport.all.get(aeroplaneObject.locationID)
    await aeroplaneObject.disembarkPassengers(airportObject.acceptPassengers.bind(airportObject))
    res.sendStatus(201)
})
module.exports = router