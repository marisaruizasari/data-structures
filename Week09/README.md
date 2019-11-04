### Week09 Assignment Documentation
# Write Temp Sensor Data to SQL database 

Instructions
------

Documentation for assignment instructions from [Data Structures GitHub](https://github.com/visualizedata/data-structures/tree/master/weekly_assignment_09)

### Due Monday, 11/4 at 6:00pm

Continue working with your sensor(s). In this assignment, you will create a new table for your sensor data and begin writing values to it at a frequency of **at least once every five minutes**. 

If you haven't yet already, create an account for [AWS Educate](https://aws.amazon.com/education/awseducate/), which will entitle you to $100 in AWS credits. You'll need this credit, because your usage will exceed the free tier allotment for the rest of the semester. 

## Setup and preparation

#### PART ONE

Decide how you will structure data from your sensors into a database (PostgreSQL or DynamoDB, depending on how you will use the data in your visualization) and define a data model/schema for your table(s). Create the appropriate table(s), in the same way you did in [Weekly Assignment 4, Part Two](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_04.md) (if using PostgreSQL) or [Weekly Assignment 5, Setup and preparation](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_05.md) (if using DynamoDB). 

For example, if you are using Postgres, your script will look something like this:  

**/setup.js**

```javascript 
const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'aaron';
db_credentials.host = 'dsdemo.c2g7qw1abcde.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE sensorData ( sensorValue boolean, sensorTime timestamp DEFAULT current_timestamp );";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
```

#### PART TWO

In this assignment, you will write a script that will run continuously in the background to periodically get sensor values and insert them into your database (at a frequency of at least once every five minutes). You will continue to work in Cloud9 for this, however, you will need to change a default setting in Cloud9 to specify that you would like your server to run continuously (rather than shutting down after a period non-use, which is a cost-saving measure). To do this, go to to your Cloud9 environment editor, click the "AWS Cloud9" menu, and choose "Preferences." In the preferences under "EC2 Instance," choose "Never" from the "Stop my environment:" dropdown. 

![](https://github.com/visualizedata/data-structures/raw/master/weekly_assignment_09/week10screenshot.jpeg)

#### PART THREE

To run your script in the background, you will be using [PM2 Runtime](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/), which is a process manager for Node.js. To install it, run:  
`npm install pm2 -g`

Then, initialize a configuration file with:  
`pm2 init`

The initialization creates a configuration file to specify the details of the ecosystem for your script (such as script name and environment variables). The default configuration file is named `ecosystem.config.js` and it will look like [this](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_09/ecosystem.config.js). 

## Assignment 

After completing all three parts of the setup, you will write a script that will make a request to the Particle API URL that you created in [Weekly Assignment 8](https://github.com/visualizedata/data-structures/tree/master/weekly_assignment_08). Your script will parse the result of the API request and insert the appropriate data into your database.  It will run continuously at a rate of **at least once every five minutes**. 

#### Starter code:   

**/app.js**

```javascript  
var request = require('request');
const { Client } = require('pg');

// PARTICLE PHOTON
var device_id = process.env.PHOTON_ID;
var access_token = process.env.PHOTON_TOKEN;
var particle_variable = 'analogvalue';
var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'aaron';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var getAndWriteData = function() {
    
    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {
        
        // Store sensor value(s) in a variable
        var sv = JSON.parse(body).result;
        
        // Convert 1/0 to TRUE/FALSE for the Postgres INSERT INTO statement
        var sv_mod; 
        if (sv == 1) {
            sv_mod = "TRUE";
        }
        else if (sv == 0) {
            sv_mod = "FALSE";
        }

        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
        client.connect();

        // Construct a SQL statement to insert sensor values into a table
        var thisQuery = "INSERT INTO sensorData VALUES (" + sv_mod + ", DEFAULT);";
        console.log(thisQuery); // for debugging

        // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
    });
};

// write a new row of sensor data every five minutes
setInterval(getAndWriteData, 300000);
```

You will run this code with PM2. First, modify the following default values in **ecosystem.config.js** :  
`script: 'app.js'` should be updated with the name of the script for your code  
`env: {NODE_ENV: 'development'}` will hold your environment variables; update it with the appropriate variables, separated by commas. It will look something like (but replacing these values with your own credentials):    

```
    env: {
      NODE_ENV: 'development',
      AWSRDS_EP: 'dsdemo.c2g7qw1abcde.us-east-1.rds.amazonaws.com',
      AWSRDS_PW: 'mypassword',
      PHOTON_ID: '0123456789abcdef',
      PHOTON_TOKEN: '123412341234'
    },
```

Finally, instead of running the file with the usual `node app.js`, you will use PM2 to begin running it in the background:  
`pm2 start ecosystem.config.js`

You can check its status with:  
`pm2 list`

You can stop it with:  
`pm2 stop 0`

### Submission requirements

Update your GitHub repository with the relevant file(s). In Canvas, submit the URL of the specific location of this work within your `data-structures` GitHub repository.

---

### Checking your work

You may want to check on your database periodically to ensure that sensor values are recording as expected. Here's some starter code for querying the sensor table: 

```javascript
const { Client } = require('pg');
const cTable = require('console.table');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'aaron';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statements for checking your work: 
var thisQuery = "SELECT * FROM sensorData;"; // print all values
var secondQuery = "SELECT COUNT (*) FROM sensorData;"; // print the number of rows
var thirdQuery = "SELECT sensorValue, COUNT (*) FROM sensorData GROUP BY sensorValue;"; // print the number of rows for each sensorValue

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
});

client.query(secondQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
});

client.query(thirdQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
    client.end();
});
```

Documentation
------

For this assignemnt I decided to use the SQL database that we've been working with for our AA data. I thought that the more structured database would make more sense for the temperature data, since I likely won't need to add additional variables along the way, and will onyl be recording temperature and date.

## Approach & file dictionary

#### Set up SQL table 

[script: setup.js](setup.js)

#### Set up EC2 instance & install PM2 Runtime

script: ecosystem.config.js (not uploaded to github)

#### Request to the Particle API

[script: app.js](app.js)

#### Check table 

[script: checkTable.js](checkTable.js)


## Set up SQL table 
script: setup.js

I created a new table in my aa SQL database called sensorData. The two columns I'm including are sensorValue and sensorTime. The first is double precision, becuase we want it to be as exact as possible and not round. sensorTime data type is timestamp DEFAULT current_timestamp, which will give me the current time at which the sensorValue was recorded and written to the table.

```javascript
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
var thisQuery = "CREATE TABLE sensorData ( sensorValue double precision, sensorTime timestamp DEFAULT current_timestamp );";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
```

## Set up EC2 instance & install PM2 Runtime
script: ecosystem.config.js (not uploaded to github)

Here I changed the EC2 instance to never stop running (usually it times out after 30 minutes), since we need it to run continously to keep recording the data at set intervals (see instructions part 2 above).

I installed [PM2 Runtime](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) process manager:
`npm install pm2 -g`

And initialized a configuration file with:  
`pm2 init`

The configuration file, ecosystem.config.js, is not uploaded to github beccause it contains my database password and API key. However the format looks something like this:

```
    env: {
      NODE_ENV: 'development',
      AWSRDS_EP: 'dsdemo.c2g7qw1abcde.us-east-1.rds.amazonaws.com',
      AWSRDS_PW: 'mypassword',
      PHOTON_ID: '0123456789abcdef',
      PHOTON_TOKEN: '123412341234'
    },
```

## Request to the Particle API
script: app.js

I decided to wrtie to my table every minute instead of every five minutes, since I think it will be better to have too much data rather than not enough at the end of the project. 

To set this up I connected to the particle API using my photon ID and access token stored in my .env file:

```javascript
// PARTICLE PHOTON
var device_id = process.env.PHOTON_ID;
var access_token = process.env.PHOTON_TOKEN;
var particle_variable = 'tempsensor';
var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;
```

I also connected to my postgres SQL database containing my sensorData table:

```javascript
// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'asarm379';
db_credentials.host = hostLink;
db_credentials.database = 'aa';
db_credentials.password = pw;
db_credentials.port = 5432;
```

Using this getAndWriteData function, I'm inserting the sensor data stored in the 'sv' variable (parsing the JSON output from the API) into the sensorValue column, and DEFAULT (timestamp) into the sensorTime column. With setInterval, I'm requesting to run the getAndWriteData function every 60000 miliseconds, or 60 seconds. 

``` javascript
var getAndWriteData = function() {
    
    
    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {

        // Store sensor value(s) in a variable
        var sv = JSON.parse(body).result;
        
        // console.log(sv);

        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
        client.connect();

        // Construct a SQL statement to insert sensor values into a table
        var thisQuery = "INSERT INTO sensorData VALUES (" + sv + ", DEFAULT);";
        console.log(thisQuery); // for debugging

        // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
    });
};

// write a new row of sensor data every minute
setInterval(getAndWriteData, 60000);

```

## Check table 
script: checkTable.js

Finally, I created a script to check the contents of my postgres SQL sensorData table. Using a similar process to the table setup script, I connected to the database using my credentials stored in my .env file.

Then I added three queries that include all of the table data, the count of all rows, and the count of rows for each unique sensorValue:

```javascript
var thisQuery = "SELECT * FROM sensorData;"; //all data
var secondQuery = "SELECT COUNT (*) FROM sensorData;"; // print the number of rows
var thirdQuery = "SELECT sensorValue, COUNT (*) FROM sensorData GROUP BY sensorValue;"; // print the number of rows for each sensorValue


client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
});

client.query(secondQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
});

client.query(thirdQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
    client.end();
});
```

Running the checkTable.js script results in the following sample information printed to the console. Since I set this up on Thursday and it is now Monday, I already have 5298 rows in my table.

```javascript

..........
  { sensorvalue: 78.0124969482422,
    sensortime: 2019-10-31T22:23:44.880Z },
  { sensorvalue: 78.0124969482422,
    sensortime: 2019-10-31T22:24:44.967Z },
  { sensorvalue: 78.0124969482422,
    sensortime: 2019-10-31T22:25:45.128Z },
  { sensorvalue: 78.0124969482422,
    sensortime: 2019-10-31T22:26:45.232Z },
  { sensorvalue: 78.125, sensortime: 2019-10-31T22:27:44.828Z },
  { sensorvalue: 77.9000015258789,
    sensortime: 2019-10-31T22:28:44.960Z },
  ... 5198 more items ]
  
  
┌─────────┬────────┐
│ (index) │ count  │
├─────────┼────────┤
│    0    │ '5298' │
└─────────┴────────┘
┌─────────┬──────────────────┬───────┐
│ (index) │   sensorvalue    │ count │
├─────────┼──────────────────┼───────┤
│    0    │ 88.6999969482422 │  '4'  │
│    1    │ 80.7125015258789 │ '30'  │
│    2    │ 85.3249969482422 │  '3'  │
│    3    │ 86.7874984741211 │  '4'  │
│    4    │ 85.2125015258789 │  '3'  │
│    5    │ 83.4124984741211 │  '5'  │
│    6    │ 78.9124984741211 │ '83'  │
│    7    │ 78.0124969482422 │ '294' │
│    8    │ 81.0500030517578 │ '17'  │
│    9    │       81.5       │  '9'  │
│   10    │ 83.0749969482422 │  '2'  │
│   11    │ 80.1500015258789 │ '60'  │
│   12    │     85.4375      │  '3'  │
│   13    │ 87.8000030517578 │  '2'  │
│   14    │        86        │  '2'  │
│   15    │ 85.8874969482422 │  '1'  │
│   16    │ 79.4749984741211 │ '79'  │
│   17    │     77.5625      │ '132' │
│   18    │ 75.4250030517578 │  '1'  │
│   19    │ 84.0875015258789 │  '1'  │
│   20    │ 78.4625015258789 │ '91'  │
│   21    │ 79.0250015258789 │ '73'  │
│   22    │ 87.4625015258789 │  '3'  │
│   23    │ 78.2375030517578 │ '169' │
│   24    │ 84.9875030517578 │  '2'  │
│   25    │ 81.9499969482422 │  '2'  │
│   26    │ 87.2375030517578 │  '2'  │
│   27    │      84.875      │  '2'  │
│   28    │ 83.5250015258789 │  '1'  │
│   29    │     86.5625      │  '3'  │
│   30    │ 83.9749984741211 │  '7'  │
│   31    │      75.875      │ '17'  │
│   32    │     84.3125      │  '1'  │
│   33    │     83.1875      │  '4'  │
│   34    │ 78.5749969482422 │ '50'  │
│   35    │ 77.4499969482422 │ '133' │
│   36    │ 77.9000015258789 │ '237' │
│   37    │ 77.2249984741211 │ '192' │
│   38    │      82.625      │  '3'  │
│   39    │     82.0625      │  '2'  │
│   40    │ 88.4749984741211 │  '5'  │
│   41    │        77        │ '176' │
│   42    │ 79.5875015258789 │ '55'  │
│   43    │ 84.6500015258789 │  '1'  │
│   44    │ 88.5875015258789 │  '2'  │
│   45    │     80.9375      │ '27'  │
│   46    │ 76.0999984741211 │ '99'  │
│   47    │ 75.5374984741211 │  '3'  │
│   48    │ 79.3625030517578 │ '44'  │
│   49    │ 80.2624969482422 │ '20'  │
│   50    │      79.25       │ '34'  │
│   51    │ 75.6500015258789 │  '7'  │
│   52    │      87.125      │  '2'  │
│   53    │ 88.1374969482422 │  '5'  │
│   54    │ 76.2125015258789 │ '146' │
│   55    │     87.6875      │  '4'  │
│   56    │ 88.3625030517578 │  '4'  │
│   57    │ 80.8249969482422 │ '29'  │
│   58    │      78.125      │ '242' │
│   59    │ 77.7874984741211 │ '200' │
│   60    │ 86.4499969482422 │  '3'  │
│   61    │ 82.1750030517578 │  '5'  │
│   62    │ 85.7750015258789 │  '2'  │
│   63    │     78.6875      │ '69'  │
│   64    │ 87.9124984741211 │  '5'  │
│   65    │ 87.5749969482422 │  '4'  │
│   66    │     88.8125      │  '2'  │
│   67    │ 80.0374984741211 │ '47'  │
│   68    │ 85.6624984741211 │  '4'  │
│   69    │ 77.3375015258789 │ '139' │
│   70    │ 78.3499984741211 │ '131' │
│   71    │      88.25       │  '1'  │
│   72    │ 81.6125030517578 │  '3'  │
│   73    │ 87.0124969482422 │  '2'  │
│   74    │ 76.5500030517578 │ '203' │
│   75    │ 86.3375015258789 │  '2'  │
│   76    │ 85.5500030517578 │  '2'  │
│   77    │ 82.7375030517578 │  '3'  │
│   78    │      83.75       │  '3'  │
│   79    │      80.375      │ '24'  │
│   80    │ 82.4000015258789 │  '2'  │
│   81    │ 83.6374969482422 │  '2'  │
│   82    │ 80.5999984741211 │ '22'  │
│   83    │ 77.6750030517578 │ '215' │
│   84    │ 82.5124969482422 │  '3'  │
│   85    │ 86.2249984741211 │  '2'  │
│   86    │ 81.1624984741211 │ '29'  │
│   87    │ 84.5374984741211 │  '3'  │
│   88    │ 77.1125030517578 │ '259' │
│   89    │ 75.7624969482422 │ '12'  │
│   90    │ 87.3499984741211 │  '1'  │
│   91    │ 76.8874969482422 │ '112' │
│   92    │ 88.9250030517578 │  '1'  │
│   93    │ 86.9000015258789 │  '2'  │
│   94    │ 83.3000030517578 │  '4'  │
│   95    │ 84.4250030517578 │  '2'  │
│   96    │ 85.0999984741211 │  '2'  │
│   97    │ 84.7624969482422 │  '5'  │
│   98    │     76.4375      │ '177' │
│   99    │ 81.8375015258789 │  '4'  │
│   100   │ 82.9625015258789 │  '3'  │
│   101   │ 84.1999969482422 │  '3'  │
│   102   │ 86.1125030517578 │  '3'  │
│   103   │ 79.6999969482422 │ '43'  │
│   104   │     79.8125      │ '55'  │
│   105   │ 75.9875030517578 │ '83'  │
│   106   │ 76.3249969482422 │ '154' │
│   107   │ 88.0250015258789 │  '3'  │
│   108   │ 79.1374969482422 │ '50'  │
│   109   │ 81.7249984741211 │  '5'  │
│   110   │ 79.9250030517578 │ '36'  │
│   111   │ 81.3874969482422 │  '6'  │
│   112   │ 82.2874984741211 │  '4'  │
│   113   │ 82.8499984741211 │  '6'  │
│   114   │ 78.8000030517578 │ '79'  │
│   115   │ 80.4875030517578 │ '25'  │
│   116   │ 76.6624984741211 │ '222' │
│   117   │ 81.2750015258789 │ '17'  │
│   118   │ 76.7750015258789 │ '150' │
│   119   │ 83.8625030517578 │  '4'  │
└─────────┴──────────────────┴───────┘
```

## Final notes

One issue is that the timestamp is three hours ahead of the current time in NYC. I'm not sure if I should fix this before writing to the table or just adjust for it later since I already have a lot of data in my table.