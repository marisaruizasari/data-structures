### Week06 Assignment Documentation
# Queries from PostgreSQL (SQL) and DynamoDB (noSQL) databases 

Instructions
------

Documentation for assignment instructions from [Data Structures GitHub](https://github.com/visualizedata/data-structures/tree/master/weekly_assignment_06)

### Due Monday 10/14 at 6:00pm

You're going to continue working with the AA data in your PostgreSQL database and the Dear Diary data in DynamoDB. You will write and execute queries for both. 

## Part One: Write and execute a query for your AA data PostgreSQL

Data with the same format as shown in [**this sample**](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_06/data/aa_sample.csv) was added to a table in PostgreSQL in AWS (like you did in [Weekly Assignment 4](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_04.md)). It was written to a table created with this SQL statement:  
`CREATE TABLE aadata (mtgday varchar(25), mtgtime  varchar(25), mtghour int, mtglocation varchar(75), mtgaddress varchar(75), mtgregion varchar(75), mtgtypes varchar(150));`

For **part one** of this assignment, write and execute a SQL query for your AA data to filter meetings based on parameters that would make sense for your planned map. 

#### Starter Code: 

```javascript
const { Client } = require('pg');
const cTable = require('console.table');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'aaron';
db_credentials.host = 'dsdemo.c2g7qw1juwkg.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: 
var thisQuery = "SELECT mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});
```

Here are a few lines of the output to the console: 

```
Monday  19:00     Bethlehem Lutheran Church                      6935 4th Ave                      Beginner                                                 
Monday  19:00     Bishop Malloy Civic Center                     15 Parkside Rd Dr                 Beginner, Wheelchair Access                              
Monday  19:00     Blessed Virgin Mary Help of Christians Church  70-31 48th Ave                    Beginner                                                 
Monday  19:00     Bronxville Lutheran Chapel School              172 White Plains Rd               Closed, Wheelchair Access, Women                         
Monday  19:00     Christ the King Church                         141 Marcy Pl                      Beginner, Wheelchair Access                    
```

## Part Two: Write and execute a query for your Dear Diary data DynamoDB

**[This data](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_06/addToDynamo.js)** was added to a "table" in DynamoDB in AWS (like you did in [Weekly Assignment 5](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_05.md)). 

For **part two** of this assignment, write and execute a NoSQL query for your Dear Diary data in DynamoDB to filter diary entries based on parameters that would make sense for your interface. 

In DynamoDB, a query heavily depends on what you have named as the [primary key(s)](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey). **Partition key(s) must be unique.** In the "table" below, a *composite primary key* has been used, with `topic` as the *partition key* and `dt` as the *sort key*. Other *items* can be used to filter data, but only after the partition key or keys have been used. 

#### Starter Code: 

```javascript
// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "aarondiary",
    KeyConditionExpression: "#tp = :topicName and dt between :minDate and :maxDate", // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#tp" : "topic"
    },
    ExpressionAttributeValues: { // the query values
        ":topicName": {S: "work"},
        ":minDate": {N: new Date("August 28, 2019").valueOf().toString()},
        ":maxDate": {N: new Date("December 11, 2019").valueOf().toString()}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});
```







Documentation
------

## Part 1

Part 1 of this assignment focused on final assignment 1 (aa data & map). 

### Creating updated tables

In order to complete part 1 of Week06 assignment, I first started Week07 assignment. Since I had only parsed locations from my original Zone9 text file, I went back to Week02 assignment to parse data for individual meetings (see documentation for Week07). I then went back to Week05 assignment and created new tables, one for locations/addresses, and another for indiviudal meetings, linked by a location key.

Addresses Table (Create_tables/week06a.js):
```javascript
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
```

Meetings Table (Create_tables/week06a.js):
```javascript
var thisQueryMeetings = "CREATE TABLE aaMeetings (startTime varchar(25),\
                                                endTime varchar(25),\
                                                weekDay varchar(100),\
                                                groupName varchar,\
                                                locationKey int);";
// Sample SQL statement to delete a table: 
// var thisQueryMeetings = "DROP TABLE aaMeetings;"; 

client.query(thisQueryMeetings, (err, res) => {
    console.log(err, res);
    client.end();
});
```

Next I populated the addresses and meetings tables using an updated json file that contains the parsed locations and meetings. 

Sample location object from updated zone 9 json file: 

```javascript
{
	"zone": "09",
	"groupName": "Harlem 1 PM Recovery",
	"streetAddress": "22 East 119th Street",
	"buildingName": "Veterans Residence",
	"roomDetail": "1st Floor Cafeteria",
	"streetDetail": "Betw. Madison & 5th Avenues",
	"zipCode": "10035",
	"details": "ID REQUIRED TO ENTER BUILDING",
	"ada": true,
	"meetings": [{
		"weekDay": "Sundays",
		"startTime": "1:00",
		"endTime": "2:00",
		"amPm": "PM",
		"typeCode": "T"
	}, {
		"weekDay": "Mondays",
		"startTime": "1:00",
		"endTime": "2:00",
		"amPm": "PM",
		"typeCode": "B"
	}]
}
```

I made a separate array for meetings from the updated parsed zone 9 json file (Create_tables/week06b.js):

```javascript
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
```

Populating addresses table (Create_tables/week06b.js):

```javascript
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
```

I'm getting an error for the first address in the addresses table (35 East 125 Street), so I'll need to correct this for next week's assignment (However I'm only using the meetings table for this week's query):

```javascript
INSERT INTO aaAddresses VALUES (1, 09, E'TWO FOR ONE', E'35 East 125 Street', E'Harlem Children's Zone Admin. Offices', E'@ Madison Avenue', 10035, E'true');
{ error: syntax error at or near "s"
    at Connection.parseE (/home/ec2-user/node_modules/pg/lib/connection.js:604:11)
    at Connection.parseMessage (/home/ec2-user/node_modules/pg/lib/connection.js:401:19)
    at Socket.<anonymous> (/home/ec2-user/node_modules/pg/lib/connection.js:121:22)
    at Socket.emit (events.js:198:13)
    at addChunk (_stream_readable.js:288:12)
    at readableAddChunk (_stream_readable.js:269:11)
    at Socket.Readable.push (_stream_readable.js:224:10)
    at TCP.onStreamRead [as onread] (internal/stream_base_commons.js:94:17)
  name: 'error',
  length: 90,
  severity: 'ERROR',
  code: '42601',
  detail: undefined,
  hint: undefined,
  position: '97',
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'scan.l',
  line: '1128',
  routine: 'scanner_yyerror' } undefined
```

Populating meetings table (Create_tables/week06b.js):
```javascript
async.eachSeries(meetings, function(meeting, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQueryMeetings = "INSERT INTO aaMeetings VALUES (E'" + meeting.startTime +"', E'"+ meeting.endTime +"', E'" + meeting.weekDay + "', E'" + meeting.groupName + "', "+ meeting.locationKey +");";
    console.log(thisQueryMeetings);
    client.query(thisQueryMeetings, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
```

I also confirmed that my tables were properly populated by querying the entire contents of each table - this is where I realized that the addresses table is missing the first location (Create_tables/week06c.js):

```javascript
var thisQuery = "SELECT * FROM aaAddresses;";
// var thisQuery = "SELECT * FROM aaMeetings;";

client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});
```

### Executing a SQL query

For my SQL query, I wanted to filter meetings based on a two select parameters: location and weekday. Here I queried meetings that occur at location 3 (key referencing my Addresses table), on Wednesdays or Thursdays.

Query request (week06_1.js):
```javascript
var thisQuery = "SELECT weekday, starttime, endtime, groupname, locationkey FROM aaMeetings WHERE locationkey = 3 and weekday = 'Wednesdays' or weekday = 'Thursdays';";

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});
```

Query results:

```
weekday     starttime  endtime  groupname         locationkey
----------  ---------  -------  ----------------  -----------
Wednesdays  8:00       9:00     Grupo Nueva Vida  3          
Thursdays   8:00       9:00     Grupo Nueva Vida  3 
```
### Part 1 Reflections

This exercise was helpful to re-structure my data and parse additional information. It's key to note here that I haven't included geocoded data in this version of the addresses table. For next week I need to add the latitude and longitude to my addresses table, and make a decision about whether I will keep my original database model from Week04, or use a new database structure. 

It was helpful to go back to Week02 to parse my zone 9 file, I'm hoping this will make completing Week07 assignment a bit easier, though I'm worried that since my zone only had four meetings and was relatively simple, my parsing method might not work or return as clean results for the remaining 9 zones.

## Part 2

Part 2 of Week06 assignment focused on the Process Blog for Final Assignment 2.

### Update DynamoDB table 

To complete part 2 of Week06 assignment, I first went back to Week05 assignment to update my DynamoDB 'table' of blog entries:

First, I changed the data type of my date sort key to Number instead of String (Week05/week05Update.js): 

```javascript
class BlogEntry {
  constructor(Category, date, weekday, entry, stress, sleep, gym) {
    this.Category = {};
    this.Category.S = Category;
    this.Date = {}; 
    this.Date.N = new Date(date).valueOf().toString();
    this.weekday = {};
    this.weekday.S = weekday;
    this.entry = {};
    this.entry.S = entry;
    this.stress = {};
    this.stress.N = stress.toString(); 
    this.sleep = {};
    this.sleep.N = sleep.toString();
    if (gym != null) {
      this.gym = {};
      this.gym.SS = gym; 
    }
    this.month = {};
    this.month.N = new Date(date).getMonth().toString();
  }
}
```

Next I added 7 new entries to this 'table' (Week05/week05Update.js):

```javascript
blogEntries.push(new BlogEntry('Weekend', 'September 29, 2019', "Sunday", "I worked on my DVIA presentation and data structures assignment 6. I went to an exercise event in Union Square Park with my friend Annabelle", 2, 8, ["core", "yoga"]));
blogEntries.push(new BlogEntry('Weekday, no class', 'September 30, 2019', "Monday", "I spent the day at the 16th st. library working on my quant problem set. It ended up being much longer than I thought it would", 5, 7));
blogEntries.push(new BlogEntry('Weekday, class', 'October 1, 2019', "Tuesday", "We presented our ideas for Major Studio project 2, I decided to continue working with the sculptures data.", 6, 6));
blogEntries.push(new BlogEntry('Weekday, class', 'October 2, 2019', "Wednesday", "I presented on WEB Debois in DVIA, I really enjoyed learning more about him and talking about his work and legacy.", 7, 5, ["3mi run"]));
blogEntries.push(new BlogEntry('Weekday, class', 'October 3, 2019', "Thursday", "I lead reading discussion in Major Studio", 2, 8));
blogEntries.push(new BlogEntry('Weekday, no class', 'October 4, 2019', "Friday", "I went to Zach's office hours and worked on Major Studio", 2, 7, ["3mi run"]));
blogEntries.push(new BlogEntry('Weekend', 'October 5, 2019', "Saturday", "Another day spent at the library. I tried to parse my original txt files for the data structures aa project for addtional information about meetings... it wasn't successful", 5, 8));
```

### Executing a noSQL query

Here I queried blog entries using the partition key of category and sort key of date. My query requested entries on weekdays that I have class ("Weekday, class") that were logged between September 24th and October 3rd (week06_2.js):

```javascript
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
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});
```

Query results:

```javascript 
Query succeeded.
***** ***** ***** ***** ***** 
 { Date: { N: '1569283200000' },
  entry:
   { S:
      'We presented our Major Studio Met projects, it was awesome to see everyone\'s work.' },
  weekday: { S: 'Tuesday' },
  month: { N: '8' },
  gym: { SS: [ 'abs', 'legs' ] },
  sleep: { N: '5' },
  stress: { N: '4' },
  Category: { S: 'Weekday, class' } }
***** ***** ***** ***** ***** 
 { Date: { N: '1569369600000' },
  entry:
   { S:
      'I presented my week 5 assignment in Data Structures and finished my clock assignment for DVIA' },
  weekday: { S: 'Wednesday' },
  month: { N: '8' },
  gym: { SS: [ '3mi run', 'arms' ] },
  sleep: { N: '5' },
  stress: { N: '7' },
  Category: { S: 'Weekday, class' } }
***** ***** ***** ***** ***** 
 { Date: { N: '1569456000000' },
  entry:
   { S:
      'I did my Major Studio reading and worked on my Adv Quant problem set on multiple regression' },
  weekday: { S: 'Thursday' },
  month: { N: '8' },
  sleep: { N: '6' },
  stress: { N: '2' },
  Category: { S: 'Weekday, class' } }
***** ***** ***** ***** ***** 
 { Date: { N: '1569888000000' },
  entry:
   { S:
      'We presented our ideas for Major Studio project 2, I decided to continue working with the sculptures data.' },
  weekday: { S: 'Tuesday' },
  month: { N: '9' },
  sleep: { N: '6' },
  stress: { N: '6' },
  Category: { S: 'Weekday, class' } }
***** ***** ***** ***** ***** 
 { Date: { N: '1569974400000' },
  entry:
   { S:
      'I presented on WEB Debois in DVIA, I really enjoyed learning more about him and talking about his work and legacy.' },
  weekday: { S: 'Wednesday' },
  month: { N: '9' },
  gym: { SS: [ '3mi run' ] },
  sleep: { N: '5' },
  stress: { N: '7' },
  Category: { S: 'Weekday, class' } }
***** ***** ***** ***** ***** 
 { Date: { N: '1570060800000' },
  entry: { S: 'I lead reading discussion in Major Studio' },
  weekday: { S: 'Thursday' },
  month: { N: '9' },
  sleep: { N: '8' },
  stress: { N: '2' },
  Category: { S: 'Weekday, class' } }

```

### Part 2 Reflections

This part of the assignment was a bit more straightforward to me, though I think I need to do a bit more reading on the data types (number, string etc.) and why we should be using certain ones with our queries in mind. 

This is also relevant for part 1 of the assignment, where we are choosing the data type for each column in our PostgreSQL table (I think this may be the issue with the first address in the Addresses table).