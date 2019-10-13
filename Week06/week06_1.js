const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});
const hostLink = process.env.HOST_LINK;
const pw = process.env.RDS_PW;

const { Client } = require('pg');
const cTable = require('console.table');

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

// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: 
var thisQuery = "SELECT weekday, starttime, endtime, groupname, locationkey FROM aaMeetings WHERE locationkey = 3 and weekday = 'Wednesdays' or weekday = 'Thursdays';";

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});