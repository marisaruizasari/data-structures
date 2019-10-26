### Week07 Assignment Documentation
# Parse & Clean All AA Data

Instructions
------

Due Monday 10/21 at 6:00pm
Finish parsing and cleaning the rest of the data in your assigned "zone" (the zone that corresponds with the last digit of your student ID number) and all other zones, and update/replace your PostgreSQL table(s) with the new data. This should include all the data you need for the final map in Final Assignment 1.

Details
Go back to the raw file you saved in Weekly Assignment 1 and finish parsing the rest of the file (that you started doing in Weekly Assignment 2). Parse and clean all relevant data that you will need to map and display the AA meetings for your zone. Make sure everything is geocoded (Weekly Assignment 3) and replace the table(s) you wrote in Weekly Assignment 4 with the new, complete (and cleaned!) data.

Then do the same for the remaining zones. For this assignment, you must have parsed/cleaned all ten zones.

Submission requirements
Update your GitHub repository with the relevant file(s). In Canvas, submit the URL of the specific location of this work within your data-structures GitHub repository.


Documentation
------
## Approach & file dictionary 

1. Parse all 10 zones

script: parse-aaAll.js
    
output: jsonFiles/allZones2.json
    
2. Geocode all locations 

script: geocode-aaAll.js
    
output: jsonFiles/GeocodedAllZones2.json
    
3. Clean and assign location primary key (PK) 
    
script: cleanAndCode.js

output: jsonFiles/allZonesWithLocationPK2.json

4. Create separate json files for meetings and locations 

script: makeTableJsons.js
    
output: jsonFiles/allMeetingsWithPK.json, 
jsonFiles/locationPKFortable.json

5. Create, populate, & test query SQL database tables
    
script: Create_tables/week07a.js,
Create_tables/week07b.js,
Create_tables/week07c.js

output: see documentation sections below

## 1. Parse all 10 zones

#### script: parse-aaAll.js

#### output: jsonFiles/allZones2.json

The structure of my final json should be an array of objects for each unique location+group combination, with nested set of meeting instances for each location+group combination. I first created an empty array to hold the final data, and empty object to hold each unique location+group information.
```javascript
// create empty array for final addresses and variables for address components
let meetingData = [];

let location = new Object();

```

I then created an array of file numbers and looped through this array to parse all of the zones and write to one json file containing all locations & meetings
```javascript
var filePath = '/home/ec2-user/environment/data-structures/Week01/aa-data/';
var fileNumber = [
    'm01',  
    'm02',  
    'm03',  
    'm04',  
    'm05',  
    'm06',  
    'm07',  
    'm08',  
    'm09',  
    'm10'
    ];
    
    
    fileNumber.forEach(file => {
        
        
    // load the AA meeting text file into a variable, `content`
    var content = fs.readFileSync('/home/ec2-user/environment/data-structures/Week01/aa-data/' + file + '.txt');
    
    // load `content` into a cheerio object
    var $ = cheerio.load(content);
```

I created an empty address details object to hold each object shell (location + nested meeting instance) and went three table rows deep to parse location information from the first td in that row 

```javascript
var addressDetails = new Object();
        
        $(elem).find('td').eq(0).each(function(i, elem) {
            
            //variables
            var zone = file.match(/\d+/);
            var groupName = $(elem).html().split('<br>')[1].trim().split('-')[0].split('<b>')[1].trim();
            var streetAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
            var buildingName = ($(elem).find('h4').text().trim());
            var roomDetail = $(elem).html().split('<br>')[2].trim().split(',')[1].trim();
            var streetDetail = $(elem).html().split('<td>')[0].trim().split('<br>')[3].trim().split('(').pop().split(')')[0];
            var zipCode = $(elem).text().match(/\d{5}/);
            var wheelChair = $(elem).text().match(/(Wheelchair access)/);
            var ada = false;
            var miscDetails = $(elem).find('div').text().trim();
            
            //conditions & transformations
            streetDetail = streetDetail.replace('@', 'At');
            streetDetail = streetDetail.replace('Betw.', 'Between');
            
            if (zipCode != null && zipCode != undefined){
                addressDetails.zipCode = zipCode[0]
            };
        
            if (wheelChair != null && wheelChair != undefined) {
                ada = true
            };
            
            //assign address detail object properties 
            addressDetails.zone = zone[0];
            addressDetails.groupName = groupName;
            addressDetails.streetAddress = streetAddress;
            addressDetails.buildingName = buildingName;
            addressDetails.roomDetail = roomDetail;
            addressDetails.streetDetail = streetDetail;
            addressDetails.ada = ada;
            addressDetails.miscDetails = miscDetails;
```
I created an empty array to hold the meeting instances and parsed meeting instance information from the second td in that row. I then assigned a meeting property to my shell object (address details) and set it equal to my array of meeting instances.

```javascript
//array to hold each meeting instance per location
        var meetings = [];
        
        // Meeting date and time components 
        $(elem).find('td').eq(1).each(function(i, elem) {
                    
            //text within each meeting info td (contains multiple meeting times)
            var meetingInfo = $(elem).text().trim();  
            meetingInfo = meetingInfo.replace(/[ \t]+/g, " ");
            meetingInfo = meetingInfo.replace(/[\r\n|\n]/g, " ");
            meetingInfo = meetingInfo.split("           ");
            
            // separate into array of each meeting time and trim 
            var meetingInfoEach = meetingInfo[0].split("        ").map(function(item) {
                return item.trim();
            });
            // console.log('---------------------------------');
            // // // console.log(meetingInfo);
            // console.log(meetingInfoEach);
            
            //for each meeting instance split on desired components and create meeting object to hold components from array position
            for (var i = 0; i<meetingInfoEach.length; i++) {
            //split on special interest
            var interest = meetingInfoEach[i].split('Special Interest')[1];
            var meetingInfoEachSplitInterest;
            if (interest) {
                meetingInfoEachSplitInterest = interest.trim();
            } else {
                meetingInfoEachSplitInterest = '';
            }
             
            // console.log('----------------------------')
            // console.log(meetingInfoEachSplitInterest);
            
            //split on type
            var type = meetingInfoEach[i].split('Type ')[1]
            var meetingInfoEachSplitTypeCode;
            var meetingInfoEachSplitTypeName;
            if (type) {
                meetingInfoEachSplitTypeCode = type.split(' ')[0];
                if (type.match('Special')) {
                    meetingInfoEachSplitTypeName = type.split('= ')[1].split(' Special')[0];
                } else {
                    meetingInfoEachSplitTypeName = type.split('= ')[1];
                }
            } else {
                meetingInfoEachSplitTypeName = '';
            }
             
            // console.log('----------------------------')
            // console.log(meetingInfoEachSplitTypeCode);
            // console.log('****')
            // console.log(meetingInfoEachSplitTypeName);
            
            //split into array on spaces - for meeting times
            var meetingInfoEachSplit = meetingInfoEach[i].split(' ');
            // console.log("****");
            // console.log (meetingInfoEachSplit);
            
            //generate 24hr clock hour from start time
             var startTime = meetingInfoEachSplit[2];
             var amPm = meetingInfoEachSplit[3];
             var timeSplit = startTime.split(':')[0];
             var hour;
             
            if (amPm == 'PM' && timeSplit < 12) {
               hour = parseInt(timeSplit) + 12; 
            } else if(amPm == 'AM' && timeSplit == 12){
                hour = 24;
            } else {
                hour = parseInt(timeSplit);
            };
            
            //meeting instance object to push to meetings array
            var meeting = new Object();
                
                meeting.weekDay = meetingInfoEachSplit[0];
                meeting.startTime = startTime;
                meeting.endTime = meetingInfoEachSplit[5];
                meeting.amPm = amPm;
                meeting.hour = hour;
                meeting.typeCode = meetingInfoEachSplitTypeCode;
                meeting.typeName = meetingInfoEachSplitTypeName;
                meeting.interest = meetingInfoEachSplitInterest;
    
                // console.log('*****')
                // console.log(meeting);
                
                meetings.push(meeting);
                addressDetails.meetings = meetings;
            }
        });
```

finally, for each tr that I was targeting, I set the empty locations object equal to my address details object, and pushed each of these objects to the final meeting data array that I declared at the beginning of the script. I wrote this array to a json file (allZones2).
```javascript
            location = addressDetails;
            meetingData.push(location);
    }
});
    
    
});

console.log('****');
console.log(meetingData);
console.log('****');
console.log(`Number of meeting locations in all zones: ${meetingData.length}`);

         
fs.writeFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/allZones2
```

## 2. Geocode all locations 

#### script: geocode-aaAll.js

#### output: jsonFiles/GeocodedAllZones2.json

This mainly mirrors my week03 script, here I just added zipcode to the api query url to make the geocoding more accurate. I created a new array with the geocode information nested in each object & wrote the new array to a json file (GeocodedAllZones2.json).

```javascript
// to hold final geocoded data
var geocodedMeetingData = [];

// eachSeries in the async module iterates over an array and operates on each item in the array in series. This creates a string for the query
async.eachSeries(meetingData, function(value, callback) {
    // console.log(value.streetAddress);
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.streetAddress.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&zip=' + value.zipCode;
    apiRequest += '&format=json&version=4.01';
    
    //  console.log(apiRequest);
    
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            // console.log(tamuGeo);
            // console.log('*****')
            // console.log(tamuGeo['FeatureMatchingResultType']);
            // console.log(tamuGeo['OutputGeocodes'][0]);
            
            // request only the latitude and longitude outputs 
            
            var geocodeInfo = new Object();
            
            geocodeInfo.geoAddress = tamuGeo['InputAddress']['StreetAddress'];
            geocodeInfo.lat = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude'];
            geocodeInfo.long = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude'];
            geocodeInfo.matchScore = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['MatchScore'];
            
            
            value.geocodeInfo = geocodeInfo;
            
            geocodedMeetingData.push(value);
            
            // console.log('*****')
            // console.log(value);
        }
    
    });
```

## 3. Clean and assign location primary key (PK) 

#### script: cleanAndCode.js

#### output: jsonFiles/allZonesWithLocationPK2.json

I first replaced addresses that had input errors. This code is quite redundnant, but I couldn't get it to work by replacing with variables.
```javascript
meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('10 E UNION SQ New York NY', '10 UNION SQ E New York NY');
    meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('152 W 71ST ST New York NY undef', '152 W 71ST ST New York NY');
    meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('164 W 74 ST New York NY','164 W 74TH ST New York NY');
    meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('20 CUMMINGS ST New York NY', '20 CUMMING ST New York NY');
    meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('22 BARCLAY ST New York NY undef', '22 BARCLAY ST New York NY');
    meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('232 W 11TH ST New York NY undef', '232 W 11TH ST New York NY');
    meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('273 BOWERY New York NY', '273 BOWERY ST New York NY');
    meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('28 GRAMMERCY PARK S New York NY', '28 GRAMERCY PARK S New York NY');
    meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('296 NINTH AVE New York NY', '296 9TH AVE New York NY');
    meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('4 W 76TH IN ST New York NY', '4 W 76TH ST New York NY');
    meetingData[i].geocodeInfo.geoAddress = meetingData[i].geocodeInfo.geoAddress.replace('7 E 10TH STRERT New York NY', '7 E 10TH ST New York NY');
```

I then generated a list of unique addresses by pulling out each street address into an array, sorting the array alphabetically, and writing unique addresses (that didn't match the previous array index position) to a new array. Here I used the address output from the geocode api. Some of the zipcodes were incorrect in the original text files, so I removed them here to avoid duplicating addreses that were not unique.
```javascript
var locations = [];

//pull out each location's address into array
updatedMeetingData.forEach(object => {
    var address = object.geocodeInfo.geoAddress;
    // console.log(address);
    locations.push(address);
    
})

// console.log(locations);
// console.log('*****')
// console.log(locations.length);

//sort locations array to get addresses in order (repeats will be next to each other)
function sort(a) {
    return a.sort();
}

sort(locations);

// // remove zipcode to match more easily
var locationsNoZip = [];

var zip = /\s\d{5}/g;


locations.forEach(location => {
    var locationNoZip = location.split(zip)[0];
    // console.log(locationNoZip);
    var locationNoZipDef = locationNoZip.split(' undef')[0];
    locationsNoZip.push(locationNoZipDef);
});

// console.log(locationsNoZip);
// console.log('*****')
// console.log(locationsNoZip.length);




// create array for unique addresses and loop through locations array to push only unique addresess (if it doesn't match the address in the pior array position)
var uniqueAddresses = [];

for (var i=0; i<locationsNoZip.length; i++) {
    if (locationsNoZip[i] != locationsNoZip[i-1]) {
        var uniqueLocation = locationsNoZip[i];
        // console.log(uniqueLocation);
        uniqueAddresses.push(uniqueLocation);
    }
}

console.log(uniqueAddresses);
console.log('****');
console.log(uniqueAddresses.length);
```

Lastly, I looped through my array of all location data and assigned a pk to each unique location by matching to the uniqueAddresses array. I wrote my final array to a new json file (allZonesWithLocationPK2).

```javascript
var updatedMeetingDataPK = [];
    
updatedMeetingData.forEach(location => {
       
    for(var a=0; a<uniqueAddresses.length; a++) {
        if(location.geocodeInfo.geoAddress.match(uniqueAddresses[a])) {
            // console.log(location);
            location.addressPK = a+1;
            updatedMeetingDataPK.push(location);
        }
    }
});
```

## 4. Create separate json files for meetings and locations 

script: makeTableJsons.js

output: jsonFiles/allMeetingsWithPK.json, 
            jsonFiles/locationPKFortable.json
            
Since my new json file (allZonesWithLocationPK2) had a location pk within each object, I was able to write two new json files - one containing an array of all meeting instances, and another containing an array of all locations, linked by location PK. I'd like to clean up this file a bit and I won't describe in detail here, but my final outputs were the allMeetingsWithPK.json and locationPKFortable.json which I used in the following section to populate my database.

## 5. Create, populate, & test query SQL database tables

#### script: A. Create_tables/week07a.js,
        B. Create_tables/week07b.js,
        C. Create_tables/week07c.js
        
### A. Create tables

One table for addresses 
```javascript
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
```

One table for meeting instances 
```javascript
var thisQueryMeetings = "CREATE TABLE aaMeetings (meetingPK int,\
                                                addressPK int,\
                                                zone varchar(25),\
                                                groupName varchar,\
                                                weekDay varchar(100),\
                                                startTime varchar(25),\
                                                endTime varchar(25),\
                                                hour int,\
                                                amPm varchar(25),\
                                                typeCode varchar(25),\
                                                typeName varchar(25),\
                                                interest varchar);";
// Sample SQL statement to delete a table: 
// var thisQueryMeetings = "DROP TABLE aaMeetings;"; 

client.query(thisQueryMeetings, (err, res) => {
    console.log(err, res);
    client.end();
});
```

### B. Populate tables

I populated each table. Here I had some issues with apostrophes (it wouldn't accept unescaped apostrophes so I had to go back to the prior files to replace). See example below for populating addresses table:
```javascript
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
```

### C. Sample query 

I checked that the tables were populated correctly and that I could query based on meeting times and days.

Here is an example query for Beginner meetings ocurring on Mondays after 8pm:
```javascript
var thisQuery = "SELECT weekDay, startTime, hour, addressPK, typeName, interest FROM aaMeetings WHERE weekDay = 'Mondays' and typeName = 'Beginners meeting' and hour >= 20;";
```
Console output:
```javascript
ec2-user:~/environment/data-structures/Week07/Create_tables $ node week07c.js
null [ { weekday: 'Mondays',
    starttime: '9:15',
    hour: 21,
    addresspk: 96,
    typename: 'Beginners meeting',
    interest: '' },
  { weekday: 'Mondays',
    starttime: '8:00',
    hour: 20,
    addresspk: 14,
    typename: 'Beginners meeting',
    interest: 'Women' },
  { weekday: 'Mondays',
    starttime: '9:00',
    hour: 21,
    addresspk: 162,
    typename: 'Beginners meeting',
    interest: '' },
  { weekday: 'Mondays',
    starttime: '10:00',
    hour: 22,
    addresspk: 143,
    typename: 'Beginners meeting',
    interest: '' },
  { weekday: 'Mondays',
    starttime: '8:00',
    hour: 20,
    addresspk: 70,
    typename: 'Beginners meeting',
    interest: '' } ]
```
