#!/usr/bin/env node

import minimist from "minimist";

import fetch from "node-fetch";

import moment from "moment-timezone";

const args = minimist(process.argv.splice(2));

if(args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.
    `);
    process.exit(0);
}

let latitude = 0;
let longitude = 0;
if(args.n) {
    latitude = args.n;
} else if (args.s) {
    latitude = -args.s;
} else {
    console.log('Latitude must be in range');
}
if(args.e) {
    longitude = args.e;
} else if (args.w) {
    longitude = -args.w;
} else {
    console.log('Longitude must be in range');
}

let timezone = moment.tz.guess();
if(args.z) {
    timezone = args.z;
}

let day = 1;
if(args.d || args.d==0) {
    day = args.d;
}

const response = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude='
    + latitude
    + '&longitude='
    + longitude +
    '&daily=precipitation_hours&timezone='
    + timezone);

const data = await response.json();

if(args.j) {
    console.log(data);
}

let result = ''
if(data.daily.precipitation_hours[day] != 0){
    result = 'You might need your galoshes ';
} else {
    result = "You probably won't need your galoshes ";
}

if (day == 0) {
    result += "today.";
} else if (day > 1) {
    result += "in " + day + " days.";
} else {
    result += "tomorrow.";
}

console.log(result);