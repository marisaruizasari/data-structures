// dependencies
var async = require('async'); // npm install async
var fs = require('fs');

// considered exploring USPS api but didn't end up using
// const USPS = require('usps-webtools');
 
// const usps = new USPS({
//   server: 'http://production.shippingapis.com/ShippingAPI.dll',
//   userId: 'USPS User id',
//   ttl: 10000 //TTL in milliseconds for request
// });

// read json address file 
var meetingData = fs.readFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/GeocodedAllZones2.json');
meetingData = JSON.parse(meetingData);


var updatedMeetingData = [];

//replace error addresses

for (var i=0; i<meetingData.length; i++) {
    
    var geoAdd = meetingData[i].geocodeInfo.geoAddress;
    
    // geoAdd = geoAdd.replace('10 E UNION SQ New York NY', '10 UNION SQ E New York NY');
    // geoAdd = geoAdd.replace('152 W 71ST ST New York NY undef', '152 W 71ST ST New York NY');
    // geoAdd = geoAdd.replace('164 W 74 ST New York NY','164 W 74TH ST New York NY');
    // geoAdd = geoAdd.replace('20 CUMMINGS ST New York NY', '20 CUMMING ST New York NY');
    // geoAdd = geoAdd.replace('22 BARCLAY ST New York NY undef', '22 BARCLAY ST New York NY');
    // geoAdd = geoAdd.replace('232 W 11TH ST New York NY undef', '232 W 11TH ST New York NY');
    // geoAdd = geoAdd.replace('273 BOWERY New York NY', '273 BOWERY ST New York NY');
    // geoAdd = geoAdd.replace('28 GRAMMERCY PARK S New York NY', '28 GRAMERCY PARK S New York NY');
    // geoAdd = geoAdd.replace('296 NINTH AVE New York NY', '296 9TH AVE New York NY');
    // geoAdd = geoAdd.replace('4 W 76TH IN ST New York NY', '4 W 76TH ST New York NY');
    // geoAdd = geoAdd.replace('7 E 10TH STRERT New York NY', '7 E 10TH ST New York NY');

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
    
    // console.log(meetingData[i]);
    updatedMeetingData.push(meetingData[i]);
}


// console.log(updatedMeetingData);
// console.log('***')
// console.log(updatedMeetingData.length);


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


var updatedMeetingDataPK = [];
// var uniqueLocationsArray = [];
    
updatedMeetingData.forEach(location => {
       
    for(var a=0; a<uniqueAddresses.length; a++) {
        if(location.geocodeInfo.geoAddress.match(uniqueAddresses[a])) {
            // console.log(location);
            location.addressPK = a+1;
            updatedMeetingDataPK.push(location);
            
            
            
        }
    }
    
});

// console.log(updatedMeetingDataPK);
// console.log('***')
// console.log(updatedMeetingDataPK.length);




// var addressList = [];
// var address = {};

// for (var b=0; b<uniqueAddresses.length; b++) {
//     address.streetAddress = uniqueAddresses[b];
//     address.addressPK = b=1;
//     addressList.push(address);
// }

// console.log(addressList);
// console.log(updatedMeetingDataPK);
// console.log(updatedMeetingData.length);

// var meetingsArray = [];

// for (var x=0; x<updatedMeetingDataPK.length; x++){
//      updatedMeetingDataPK[x].meetings.forEach(meeting => {
//                 meeting.addressPK = updatedMeetingDataPK[x].addressPK;
//                 meetingsArray.push(meeting);
//             });
// };

// console.log(meetingsArray);
// console.log(meetingsArray.length);

// fs.writeFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/allZonesWithLocationPK2.json', JSON.stringify(updatedMeetingDataPK)); 