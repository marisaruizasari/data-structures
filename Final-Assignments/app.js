var express = require('express'), // npm install express
    app = express();

var handlebars = require('handlebars');
var fs = require('fs');
const moment = require('moment');

//sytles are in public folder, reference this
app.use(express.static('public'));

const dotenv = require('dotenv'); // npm install dotenv
dotenv.config({ path: '/home/ec2-user/environment/data-structures/.env' });
const hostLink = process.env.HOST_LINK;
const pw = process.env.RDS_PW;
const userName = process.env.USERNAME;
const database = process.env.POSGRES_DATABASE;

const { Client } = require('pg');


// ------------------> AA & Sensor Data SQL
// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = userName;
db_credentials.host = hostLink;
db_credentials.database = database;
db_credentials.password = pw;
db_credentials.port = 5432;


// ----------------------> Process Blog DynamoDB NoSQL
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";



//Sensor Data-------------------------------------------------------------------------------------->
app.get('/sensor', function (req, res1) {


    // Connect to database
    const client = new Client(db_credentials);
    client.connect();

    var secondQuery = `WITH newSensorData as (SELECT sensorTime - INTERVAL '5 hours' as hourlySensorTime, * FROM sensorData)

                  SELECT
                        EXTRACT (YEAR FROM hourlySensorTime) as sensorYear,
                        EXTRACT (MONTH FROM hourlySensorTime) as sensorMonth,
                        EXTRACT (DAY FROM hourlySensorTime) as sensorDay,
                        EXTRACT (HOUR FROM hourlySensorTime) as sensorHour,
                        AVG(sensorValue::int) as averagevalue
                        FROM newSensorData
                        GROUP BY sensorYear, sensorMonth, sensorDay, sensorHour
                        ORDER BY sensorYear, sensorMonth, sensorDay, sensorHour;`;


    client.query(secondQuery, (err, res) => {
        if (err) { throw err }
        else {
            //console.table(res.rows);

            var data = JSON.stringify(res.rows)

            res1.send(res.rows)
        }
    });

});





//AA Map -------------------------------------------------------------------------------------->
app.get('/aa', function (req, res1) {

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    console.log(req.query)

    var days = `\'${req.query.weekDays}\'`;

    if (Array.isArray(req.query.weekDays)) {

        days = ''

        for (var i = 0; i < req.query.weekDays.length; i++) {

            if (i <= req.query.weekDays.length - 2) {
                days += `\'${req.query.weekDays[i]}\',`
            }
            else if (i == req.query.weekDays.length - 1) {
                days += `\'${req.query.weekDays[i]}\'`
            }
        }

        console.log(days)
    }

    var weekDays = `(${days})`
    console.log(weekDays)

    var currentDay = req.query.now;

    var currentD = moment(currentDay).day()
    console.log(currentD)
    // console.log(weekDays)

    var thisAAQuery = `SELECT lat, long, json_agg(json_build_object('groupname', groupname, 'weekday', weekday, 'starttime', starttime, 'endtime', endtime, 'typename', typename, 'interest', interest, 'hour', hour, 'ampm', ampm, 'ada', ada, 'city', city, 'state', state, 'zipcode', zipcode, 'streetaddress', streetaddress)) as meeting
    FROM aaMeetings
    INNER JOIN aaAddresses ON aaMeetings.addressPK = aaAddresses.addressPK
    WHERE aaMeetings.weekday IN ${weekDays} AND aaMeetings.hour BETWEEN ${req.query.lowerTimeBound} AND ${req.query.upperTimeBound}
    GROUP BY lat, long;`;



    client.query(thisAAQuery, (err, res) => {
        console.log(err, res);
        // console.log(err, res.rows);

        res1.send(res.rows)

        client.end();
    });
});



//Process Blog -------------------------------------------------------------------------------------->

app.get('/pblog-page', async function (req, res) {

    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName: "process-blog-final",
        KeyConditionExpression: "category = :categoryName and #dt between :minDate and :maxDate", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt": "date"
        },
        ExpressionAttributeValues: { // the query values
            ":categoryName": { S: req.query.category },
            ":minDate": { S: new Date("August 20, 2019").toISOString() },
            ":maxDate": { S: new Date("December 24, 2019").toISOString() }
        }
    };

    var output = {};


    dynamodb.query(params, function (err, data) {
        if (err) {
            console.log('there was an error')
            throw (err);
        }
        else {

            output.blogpost = [];

            for (var i = 0; i < data.Items.length; i++) {
                output.blogpost.push({ category: data.Items[i].category.S, date: moment(data.Items[i].date.S).format("LL"), title: data.Items[i].title.S, entry: data.Items[i].entry.S, fileName: data.Items[i].fileName.S, id: data.Items[i].id.S, number: i })
            }


            fs.readFile('./pblog-handlebars.html', 'utf8', (error, templateData) => {
                var template = handlebars.compile(templateData);
                var html = template(output);
                res.send([html, output]);


            })
        }
    });


});


// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function () {
    console.log('Server listening...');
});
