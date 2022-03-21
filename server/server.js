const express = require("express")
const app = express()
const port = process.env.port || 3000
const Airport = require("../sources/Airport")
const Aeroplane = require("../sources/Aeroplane")
const Passenger = require("../sources/Passenger")
const airportRoutes = require("./routes/airportRoutes")
const aeroplaneRoutes = require("./routes/aeroplaneRoutes")
const passengerRoutes = require("./routes/passengerRoutes")

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use("/aiports", airportRoutes)
app.use("/aeroplanes", aeroplaneRoutes)
app.use("/passengers", passengerRoutes)

app.listen(port, ()=>{
    Airport.bootUp()
})