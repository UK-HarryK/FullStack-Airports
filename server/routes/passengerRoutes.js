const express = require("express")
const router = express.Router()
const Passenger = require("../../sources/Passenger")
const Aeroplane = require("../../sources/Aeroplane")
const Airport = require("../../sources/Airport")

router.get("/flyers", (req, res)=>{
    res.send(Passenger.all)
})
router.get("/flyers:id", (req, res)=>{
    let id = req.params.id
    res.send(Passenger.reqOne(id))
})
router.post("/flyers:id/board", async (req, res)=>{
    let id = req.params.id
    let { airportID, aeroplaneID } = req.body
    let passengerObject = Passenger.all.get(id)
    let aeroplaneObject = Aeroplane.all.get(aeroplaneID)
    let airportObject = Airport.all.get(airportID)
    await passengerObject.board(airportObject.flyerBoard.bind(airportObject), aeroplaneObject.acceptPassenger.bind(aeroplaneObject))
    res.sendStatus(201)
})
module.exports = router