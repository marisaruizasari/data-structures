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

// var meetings = fs.readFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/allMeetingsWithPK.json')
// var meetingsForDb = JSON.parse(meetings);
// // console.log(addressesForDb);

// async.eachSeries(meetingsForDb, function(meeting, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQueryMeetings = "INSERT INTO aaMeetings VALUES ("+ meeting.meetingPK +", "+ meeting.addressPK +", E'" + meeting.zone +"', E'" + meeting.groupName +"', E'" + meeting.weekDay + "', E'" + meeting.startTime +"', E'"+ meeting.endTime +"', "+ meeting.hour +", E'"+ meeting.amPm +"', E'"+ meeting.typeCode +"', E'"+ meeting.typeName +"', E'"+ meeting.interest +"');";
//     console.log(thisQueryMeetings);
//     client.query(thisQueryMeetings, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 

var addresses = fs.readFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/locationPKFortable.json')
var addressesForDb = JSON.parse(addresses);
// console.log(addressesForDb);

async.eachSeries(addressesForDb, function(address, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQueryMeetings = "INSERT INTO aaAddresses VALUES ("+ address.addressPK +", E'" + address.streetAddress +"', " + address.zipcode +", E'" + address.city + "', E'" + address.state +"', E'"+ address.buildingName +"', E'"+ address.ada +"', "+ address.lat +", "+ address.long +");";
    console.log(thisQueryMeetings);
    client.query(thisQueryMeetings, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
