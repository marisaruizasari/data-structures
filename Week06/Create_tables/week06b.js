var async = require('async');
const fs= require('fs')
const { Client } = require('pg');

const dotenv = require('dotenv'); // npm install dotenv
dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});
const hostLink = process.env.HOST_LINK;
const pw = process.env.RDS_PW;

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'asarm379';
db_credentials.host = hostLink;
db_credentials.database = 'aa';
db_credentials.password = pw;
db_credentials.port = 5432;

var m09addresses = fs.readFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/m09.json')
var addressesForDb = JSON.parse(m09addresses);
// console.log(addressesForDb);

var meetings = [];

addressesForDb.forEach(location => {
   location 
});

for(var i=0; i<addressesForDb.length; i++) {
    addressesForDb[i].locationKey = i+1;
    
    addressesForDb[i].meetings.forEach(meeting => {
        meeting.locationKey = addressesForDb[i].locationKey;
        meeting.groupName = addressesForDb[i].groupName;
        meetings.push(meeting);
        // console.log('***');
        // console.log(meeting);
    });
}

// console.log(meetings);

// console.log(addressesForDb);



async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQueryAddresses = "INSERT INTO aaAddresses VALUES (" + value.locationKey + ", " + value.zone + ", E'" + value.groupName + "', E'" + value.streetAddress + "', E'" + value.buildingName + "', E'" + value.streetDetail + "', " + value.zipCode + ", E'" + value.ada + "');";
    console.log(thisQueryAddresses);
    client.query(thisQueryAddresses, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 


// async.eachSeries(meetings, function(meeting, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQueryMeetings = "INSERT INTO aaMeetings VALUES (E'" + meeting.startTime +"', E'"+ meeting.endTime +"', E'" + meeting.weekDay + "', E'" + meeting.groupName + "', "+ meeting.locationKey +");";
//     console.log(thisQueryMeetings);
//     client.query(thisQueryMeetings, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 
