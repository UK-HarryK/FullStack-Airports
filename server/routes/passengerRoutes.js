const express = require("express")
const router = express.Router()
const Passenger = require("../../sources/Passenger")
const Aeroplane = require("../../sources/Aeroplane")
const Airport = require("../../sources/Airport")

router.get("/", async (req, res)=>{
    let returnArr = []
    let itrObj = Passenger.all.values()
    for(let x of itrObj){
        returnArr.push(x)
    }
    res.send(returnArr)
})
router.get("/:id", async (req, res)=>{
    let id = parseInt(req.query.id)
    let result = Passenger.all.get(id)
    if(result){
        res.send(result)
    }else{
        res.sendStatus(404)
    }
})
router.patch("/:id/board", async (req, res)=>{
    let id = parseInt(req.query.id)
    let { airportID, aeroplaneID } = req.body
    let passengerObject = Passenger.all.get(id)
    let aeroplaneObject = Aeroplane.all.get(aeroplaneID)
    let airportObject = Airport.all.get(airportID)
    await passengerObject.board(airportObject.flyerBoard.bind(airportObject), aeroplaneObject.acceptPassenger.bind(aeroplaneObject))
    res.sendStatus(201)
})
module.exports = router