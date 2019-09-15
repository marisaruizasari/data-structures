### Week03 Assignment Documentation
# Geocode addresses for AA Meetings in Manhattan 

Instructions
------

In preparation for this assignment, [create a free account with Texas A&M GeoServices](https://geoservices.tamu.edu/Signup/). 

Continue work on the file you parsed in Weekly Assignment 2. If you haven't already, organize your data into a [JSON format](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) so that it will be easier to access the data for your work on this assignment.  
[[GIST: pushing to an array](https://gist.github.com/aaronxhill/38067bb58805896fdbb5)]

Write a script that makes a request to the [Texas A&M Geoservices Geocoding APIs](http://geoservices.tamu.edu/Services/Geocode/WebService/) for each address, using the address data you parsed in Weekly Assignment 2. You'll need to do some work on the address data (using code!) to prepare them for the API queries. For example, the parsed value `50 Perry Street, Ground Floor,` should be modified to `50 Perry Street, New York, NY`. The addresses are messy and may yield weird results from the API response. Don't worry too much about this right now. But, start to think about it; in a later assignment we'll have to clean these up.  

Your final output should be a **file** that contains an **array** that contains an **object** for each meeting (which may or may not nest other arrays and objects). The array should have a length equal to the number of meetings. Each object should hold the relevant data for each meeting. For now, we're focusing on the addresses and geographic coordinates. An example:  
`[ { address: '63 Fifth Ave, New York, NY', 
latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, 
{ address: '16 E 16th St, New York, NY', 
latLong: { lat: 40.736765, lng: -73.9919024 } },
{ address: '2 W 13th St, New York, NY', 
latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ]`

Be mindful of:  
* API rate limits (you get 2,500 requests total before needing to pay TAMU for more)  
* Asyncronous JavaScript (but don't overuse `setTimeout`)  
* Keeping your API key(s) off of GitHub (use an [environment variable](https://www.npmjs.com/package/dotenv) instead)  
* Keeping only the data you need from the API response, not all the data  

Update your GitHub repository with the relevant file(s). In Canvas, submit the URL of the specific location of this work within your `data-structures` GitHub repository. 

## Starter Code

### Setting environment variables using npm `dotenv`

Environment variables help keep APIs secret (and off of GitHub!). There are several ways to create and manage environment variables; I recommend [`dotenv`](https://www.npmjs.com/package/dotenv).  

Here are the steps to set this up: 

1. In the root directory of your Cloud9 workspace (e.g. `/home/ec2-user/environment`), create a new file named `.env` with the following Linux command: `touch .env`  
2. Open the new `.env` file by double clicking the file name in the Cloud 9 abstraction of the root directory structure.  
3. In this file, you may assign new environment variables. No spaces are permitted in variables assignments (unless in a text string) and each new variable assignment should be on a new line (with no blank lines in between). For example, you could create two new environment variables with: \  
`NEW_VAR="Content of NEW_VAR variable"`  
`MYPASSWORD="ilovemykitties"`  
4. **IMPORTANT: your `.env` file should NEVER, EVER end up on GitHub.** One way to manage this is by [creating a local `.gitignore` file](https://help.github.com/en/articles/ignoring-files). This file will eventually contain all your API Keys, which should be treated as carefully as you treat passwords, credit card numbers, and family secrets. Guard it with your life. 

To access, these variables, you will use `process.env` to access the environment variables created by the `dotenv` package, as demonstrated in the starter code: 

### Node.js script

```javascript
// dependencies
var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');
const dotenv = require('dotenv'); // npm install dotenv

// TAMU api key
dotenv.config();
const apiKey = process.env.TAMU_KEY;

// geocode addresses
var meetingsData = [];
var addresses = ["63 Fifth Ave", "16 E 16th St", "2 W 13th St"];

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';
    
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            console.log(tamuGeo['FeatureMatchingResultType']);
            meetingsData.push(tamuGeo);
        }
    });
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/first.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});
```


Documentation
------

### Install dependencies and create .env for api key
I first installed the request, async, and dotenv dependencies as indicated in the starter code. I created a .env file in my Week03 directory to store my api key, and created a .gitignore file to prevent the .env file from being pushed to github.
```javascript
// dependencies
var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');
const dotenv = require('dotenv'); // npm install dotenv

// TAMU api key
dotenv.config();
const apiKey = process.env.TAMU_KEY;
```
### Read addresses from json file
Next I loaded the json file from week02 assignment that contained each of the addresses from the parsed m09 txt file. I created an addresses array and pushed the street addresses from the json file. Finally I created an empty array to store the final geocoded addresses.
```javascript
// read json address file 
var json = fs.readFileSync('/home/ec2-user/environment/data-structures/Week02/m09addressescorrected.json');
json = JSON.parse(json);
// console.log(json.length);

// create variables for input addresses and final geocoded address data 
var addresses = []

for (var i = 0; i<json.length; i++) {
addresses.push(json[i]['streetAddress']);
};
// console.log(addresses);

var meetingsData = [];
```

### Create string for query
Using the starter code, I created a string for the api query that specified the street address, city, and state for the request.
```javascript
// eachSeries in the async module iterates over an array and operates on each item in the array in series. This creates a string for the query
async.eachSeries(addresses, function(value, callback) {
    // console.log(value);
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';
```

### Request geocode components and push to empty meetingsData array
This code block requests specific information from the geocode api. I created an empty object to hold the components of interest, and rather than pull all of the output geocodes, I requested only the street address, latitude, and longitude. I then pushed the address objects to the emtpy meetingsData array. Here we use the setTimeout function to address the asynchronous nature of javascript, though I still don't fully understand when and where asynchronisity is an issue. 
```javascript
request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            //   console.log(tamuGeo);
            // request only the latitude and longitude outputs 
            var geoAddress = {}
            geoAddress.address = tamuGeo['InputAddress']['StreetAddress'];
            geoAddress.lat = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude']
            geoAddress.long = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude']
            // console.log(tamuGeo['FeatureMatchingResultType']);
            
            // console.log(geoAddress);
            
            meetingsData.push(geoAddress);
            
            console.log(meetingsData);
        }
    
    });
  
    setTimeout(callback, 2000);
```

### Write geocoded addresses to a json file
Lastly, I saved the meetingsData array containing the address objects to a json file in my Week03 directory. 
```javascript
}, function() {
    fs.writeFileSync('/home/ec2-user/environment/data-structures/Week03/geoaddressesm09.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});
```

### Final notes
I was able to save a json file with the geocoded addresses for each of the AA locations, however this file doesn't contain duplicate addresses for each meeting time within each location. I imagine that for our final map we will need this information, so my next steps are to work on creating a file that has each specific meeting time and location. 