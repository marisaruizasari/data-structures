// dependencies
var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');
const dotenv = require('dotenv'); // npm install dotenv

// TAMU api key
dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});
const apiKey = process.env.TAMU_KEY;


// read json address file 
var meetingData = fs.readFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/allZones2.json');
meetingData = JSON.parse(meetingData);
// console.log(json.length);
// console.log(json);

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
    
    setTimeout(callback, 2000);

}, function() {
    fs.writeFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/GeocodedAllZones2.json', JSON.stringify(geocodedMeetingData));
    console.log('*** *** *** *** ***');
    console.log('Number of locations: ');
    console.log(geocodedMeetingData.length);
});







