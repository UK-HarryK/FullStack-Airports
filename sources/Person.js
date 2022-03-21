const Passenger = require("./Passenger")
module.exports = class Person{
    constructor(passportNum, givenName, familyName){
        this.passportNum = passportNum
        this.givenName = givenName
        this.familyName = familyName
        this.baggage
    }
}