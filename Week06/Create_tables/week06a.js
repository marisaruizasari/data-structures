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
var thisQueryAddresses = "CREATE TABLE aaAddresses (locationKey int,\
                                                zone double precision,\
                                                groupName varchar(100),\
                                                streetAddress varchar(100),\
                                                buildingName varchar,\
                                                streetDetail varchar,\
                                                zipCode double precision,\
                                                ada varchar(100));";
// Sample SQL statement to delete a table: 
// var thisQueryAddresses = "DROP TABLE aaAddresses;"; 

client.query(thisQueryAddresses, (err, res) => {
    console.log(err, res);
    client.end();
});



// var thisQueryMeetings = "CREATE TABLE aaMeetings (startTime varchar(25),\
//                                                 endTime varchar(25),\
//                                                 weekDay varchar(100),\
//                                                 groupName varchar,\
//                                                 locationKey int);";
// // Sample SQL statement to delete a table: 
// // var thisQueryMeetings = "DROP TABLE aaMeetings;"; 

// client.query(thisQueryMeetings, (err, res) => {
//     console.log(err, res);
//     client.end();
// });