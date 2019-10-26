// Dependencies
const dotenv = require('dotenv'); // npm install dotenv
dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});
const hostLink = process.env.HOST_LINK;
const pw = process.env.RDS_PW;

const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'asarm379';
db_credentials.host = hostLink;
db_credentials.database = 'aa';
db_credentials.password = pw;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
var thisQueryAddresses = "CREATE TABLE aaAddresses (addressPK int,\
                                                streetAddress varchar,\
                                                zipcode int,\
                                                city varchar(100),\
                                                state varchar(100),\
                                                buildingName varchar,\
                                                ada varchar(100),\
                                                lat double precision,\
                                                long double precision);";
// Sample SQL statement to delete a table: 
// var thisQueryAddresses = "DROP TABLE aaAddresses;"; 

client.query(thisQueryAddresses, (err, res) => {
    console.log(err, res);
    client.end();
});



// var thisQueryMeetings = "CREATE TABLE aaMeetings (meetingPK int,\
//                                                 addressPK int,\
//                                                 zone varchar(25),\
//                                                 groupName varchar,\
//                                                 weekDay varchar(100),\
//                                                 startTime varchar(25),\
//                                                 endTime varchar(25),\
//                                                 hour int,\
//                                                 amPm varchar(25),\
//                                                 typeCode varchar(25),\
//                                                 typeName varchar(25),\
//                                                 interest varchar);";
// // Sample SQL statement to delete a table: 
// // var thisQueryMeetings = "DROP TABLE aaMeetings;"; 

// client.query(thisQueryMeetings, (err, res) => {
//     console.log(err, res);
//     client.end();
// });