var express = require('express'), // npm install express
    app = express();

var handlebars = require('handlebars');
var fs = require('fs');

//sytles are in public folder, reference this 
app.use(express.static('public'));
    
const dotenv = require('dotenv'); // npm install dotenv
dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});
const hostLink = process.env.HOST_LINK;
const pw = process.env.RDS_PW;

const { Client } = require('pg');


// ------------------> AA & Sensor Data SQL
// AWS RDS POSTGRESQL INSTANCE 
var db_credentials = new Object();
db_credentials.user = 'asarm379';
db_credentials.host = hostLink;
db_credentials.database = 'aa';
db_credentials.password = pw;
db_credentials.port = 5432;


// ----------------------> Process Blog DynamoDB NoSQL
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

    
console.log('test');

app.get('/', function(req, res) {
   res.send(`<h1>Data Structures Final Assignment Data</h1>
            <ul>
                <li><a href="/sensor">Please look at my sensor data.</a></li>
                <li><a href="/aa">Please look at my aa data.</a></li>
                <li><a href="/pblog">Please look at process blog.</a></li>
            </ul>`);
});

//sensor data page
app.get('/sensor', function(req, res1) {
    // res1.send('<h3>this is the page for my sensor data</h3>'); 
    

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to query the entire contents of a table: 
var secondQuery = "SELECT COUNT(*) FROM sensorData;"; // print the number of rows

// var rows;

console.log('test');

client.query(secondQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    // rows = res.rows
    
    var data = JSON.stringify(res.rows)
    
    res1.send(`<p> Rows:${data} </p>`)
    
    
    }
});

});

//aa data page
app.get('/aa', function(req, res1) {
    
// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to query the entire contents of a table: 

// var thisQuery = "SELECT * FROM aaMeetings;";
var thisAAQuery = "SELECT weekDay, startTime, hour, addressPK, typeName, interest FROM aaMeetings WHERE weekDay = 'Mondays' and typeName = 'Beginners meeting' and hour >= 20;";

// var thisQuery = "SELECT * FROM aaAddresses;";
// var thisQuery = "SELECT addressPK, streetAddress, zipCode, buildingName, ada, lat, long FROM aaAddresses WHERE addressPK < 10;";

client.query(thisAAQuery, (err, res) => {
    console.log(err, res.rows);
    
    var aaData = JSON.stringify(res.rows)
    
    // res1.send(`<p> AA data:${aaData} </p>`)
    
    var output = {};
    
//     var output = {
//     aaVariable: aaData,
//     aaVariable2: "replaced text 2",
//     blockTest: [{var1: "replacement 1", var2: "replacement 2"}, {var1: "replacement 3", var2: "replacement 4"}]
// };


fs.readFile('./aa.html', 'utf8', (error, data) => {
    var template = handlebars.compile(data);
    output.meetings = res.rows;
    var html = template(output);
    res1.send(html);

})
    
    
    
    client.end();
});


       
});

//process blog data page
app.get('/pblog', function(req, res) {
    
    var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "dsProcessBlog2",
    KeyConditionExpression: "Category = :categoryName and #dt between :minDate and :maxDate", // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#dt" : "Date"
    },
    ExpressionAttributeValues: { // the query values
        ":categoryName": {S: "Weekday, class"},
        ":minDate": {N: new Date("September 24, 2019").valueOf().toString()},
        ":maxDate": {N: new Date("October 3, 2019").valueOf().toString()}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        // data.Items.forEach(function(item) {
        //     console.log("***** ***** ***** ***** ***** \n", item);
        // });
        
        res.send(data.Items);
    }
});
      
});


// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});