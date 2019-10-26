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

// Sample SQL statement to query the entire contents of a table: 

// var thisQuery = "SELECT * FROM aaMeetings;";
var thisQuery = "SELECT weekDay, startTime, hour, addressPK, typeName, interest FROM aaMeetings WHERE weekDay = 'Mondays' and typeName = 'Beginners meeting' and hour >= 20;";

// var thisQuery = "SELECT * FROM aaAddresses;";
// var thisQuery = "SELECT addressPK, streetAddress, zipCode, buildingName, ada, lat, long FROM aaAddresses WHERE addressPK < 10;";



client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});



// var thisQuery = "SELECT * FROM aaAddresses;";