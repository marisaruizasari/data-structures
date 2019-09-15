// dependencies
var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');
const dotenv = require('dotenv'); // npm install dotenv

// TAMU api key
dotenv.config();
const apiKey = process.env.TAMU_KEY;


// read json address file 
var json = fs.readFileSync('/home/ec2-user/environment/data-structures/Week02/m09addressescorrected.json');
json = JSON.parse(json);
// console.log(json.length);

// create variables for input addresses and final geocoded address data 
var meetingsData = [];
var addresses = []

for (var i = 0; i<json.length; i++) {
addresses.push(json[i]['streetAddress']);
};

// console.log(addresses);

// eachSeries in the async module iterates over an array and operates on each item in the array in series. This creates a string for the query
async.eachSeries(addresses, function(value, callback) {
    // console.log(value);
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';
    
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
    
}, function() {
    fs.writeFileSync('/home/ec2-user/environment/data-structures/Week03/geoaddressesm09.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});

