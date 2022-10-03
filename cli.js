#!/usr/bin/env node
//import moment, minimist and fetch
import moment from "moment-timezone"
import minimist from "minimist"
import fetch from "node-fetch"

const args = minimist(process.argv.slice(2))
//set up Time zone: uses tz.guess() from moment-timezone by default.
let timezone = moment.tz.guess()
if (args.t) {
    timezone = args.t
}
//set up -h, Show this help message and exit.
if (args.h) {
    console.log(`
        Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -t            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.
        `)
} else {
    //set up Latitude and Longitude
    //default latitude
    let latitude = '35'
    if(args.n) {
        latitude = args.n
    }

    if(args.s) {
        latitude = args.s
    }
    //default longitude
    let longitude = '79'
    if (args.e) {
        longitude = args.e
    }
    if (args.w) {
        longitude = args.w
    }
    //output time
    const days = args.d

    if (days == 0) {
        console.log("today.")
    } else if (days > 1) {
        console.log("in " + days + " days.")
    } else {
        console.log("tomorrow.")
    }
    //fetch api
    const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude='
        + latitude
        + '&longitude='
        + longitude
        + '&daily=weathercode,temperature_2m_max,sunrise,precipitation_sum,precipitation_hours&timezone='
        + timezone)
    //json output
    const data = await response.json()
    //print output
    console.log(data)

}