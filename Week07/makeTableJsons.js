// dependencies
var async = require('async'); // npm install async
var fs = require('fs');

// read json address file 
var meetingData = fs.readFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/allZonesWithLocationPK2.json');
meetingData = JSON.parse(meetingData);

// console.log(meetingData);


var addressesWithPK = [];
var groupsWithPK = [];
var typesWithPK = [];
var meetingsWithPK = [];
var meetingsPKsOnly = [];

var groups = [];
var types = [];



meetingData.forEach(object => {
    
    //addresses with PK 
    var zip = /\s\d{5}/g;
    var address = {};
    
    address.addressPK = object.addressPK;
    address.streetAddress = object.geocodeInfo.geoAddress.split(zip)[0];
    address.zipcode = object.zipCode;
    address.city = 'New York';
    address.state = 'NY';
    object.buildingName = object.buildingName.replace(/'/g,'&apos;')
    if (object.buildingName && object.buildingName != undefined) {
        address.buildingName = object.buildingName
    } else {
        address.buildingName = ''
    }
    address.ada = object.ada;
    address.lat = object.geocodeInfo.lat;
    address.long = object.geocodeInfo.long;
    
    addressesWithPK.push(address);
    
    //groups no PK
    // object.groupName = object.groupName.replace('@', 'AT');
    // object.groupName = object.groupName.replace('&amp;', '&');
    var group = object.groupName;
    groups.push(group);
    
    //types no PK
    object.meetings.forEach(meeting => {
        var type = meeting.typeCode;
        types.push(type);
        
    });
});


addressesWithPK.sort(function(a, b) {
  return a.addressPK - b.addressPK;
});
// console.log(addressesWithPK);
// console.log('****');
// console.log(addressesWithPK.length);

var finalAddressTable = [];

finalAddressTable.push(addressesWithPK[0]);

for (var x=1; x<addressesWithPK.length; x++) {
    if (addressesWithPK[x].addressPK != addressesWithPK[x-1].addressPK) {
        finalAddressTable.push(addressesWithPK[x]);
        // console.log(addressesWithPK[x])
    }
}

fs.writeFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/locationPKFortable.json', JSON.stringify(finalAddressTable)); 

// for (var i=0; i<finalAddressTable.length; i++){
//     console.log(finalAddressTable[i].addressPK);
// }

// console.log(finalAddressTable);
// console.log('****');
// console.log(finalAddressTable.length);

// console.log(types);
// console.log('****');
// console.log(types.length);


function sort(a) {
    return a.sort();
}

//sort groups 
sort(groups);
// console.log(groups);
// console.log('****');
// console.log(groups.length);

//clean groups
var cleanedGroups = [];
for (var i=0; i<groups.length; i++) {
    if (groups[i] != groups[i-1]) {
        cleanedGroups.push(groups[i])
    }
}
// console.log(cleanedGroups);
// console.log('***');
// console.log(cleanedGroups.length);


//create PKs for cleaned groups
for (var a=0; a<cleanedGroups.length; a++) {
    var groupWithPK = {};
    groupWithPK.groupPK = a+1;
    groupWithPK.groupName = cleanedGroups[a];
    groupsWithPK.push(groupWithPK);
}
// console.log(groupsWithPK);
// console.log('***');
// console.log(groupsWithPK.length);
// fs.writeFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/groupsNotCleanWithPK.json', JSON.stringify(groupsWithPK));


//sort types
sort(types);
// console.log(types);
// console.log('****');
// console.log(types.length);

// clean types
var cleanedTypes = [];
for (var i=0; i<types.length; i++) {
    if (types[i] != types[i-1] && types[i] != undefined) {
        cleanedTypes.push(types[i])
    }
}
// console.log(cleanedTypes);
// console.log('****');
// console.log(cleanedTypes.length);

//create PKs for cleaned types
for (var a=0; a<cleanedTypes.length; a++) {
    var typeWithPK = {};
    typeWithPK.typePK = a+1;
    typeWithPK.typeName = cleanedTypes[a];
    typesWithPK.push(typeWithPK);
}
// console.log(typesWithPK);
// console.log('***');
// console.log(typesWithPK.length);



//meetings
var pk = 1;
meetingData.forEach(object => {
    object.meetings.forEach(meeting => {
        var meetingWithPK = {};
        meetingWithPK.meetingPK = pk;
        meetingWithPK.addressPK = object.addressPK;
        meetingWithPK.zone = object.zone;
        
        if (object.hasOwnProperty('groupName') && object.groupName != undefined) {
            meetingWithPK.groupName = object.groupName;
        } else {
            meetingWithPK.groupName = '';
        }
            // object.groupName = object.groupName.replace('@', 'AT');
            // object.groupName = object.groupName.replace('&amp;', '&');
            // groupsWithPK.forEach(group => {
            //     if (group.groupName.match(object.groupName)) {
            //         meetingWithPK.groupPK = group.groupPK;
            //     } else if (object.hasOwnProperty('groupName') == false | object.groupName == undefined){
            //         meetingWithPK.groupPK = '';
            //     } 
            // });
        meetingWithPK.weekDay = meeting.weekDay;
        meetingWithPK.startTime = meeting.startTime;
        meetingWithPK.endTime = meeting.endTime;
        meetingWithPK.hour = meeting.hour
        meetingWithPK.amPm = meeting.amPm;
        meetingWithPK.interest = meeting.interest;
        
       
        
        if (meeting.hasOwnProperty('typeName') && meeting.typeName != undefined) {
        meetingWithPK.typeName = meeting.typeName;
        } else {
            meetingWithPK.typeName = '';
            // console.log(meetingWithPK);
            // console.log('****');
        }
        
        if(meeting.hasOwnProperty('typeCode') && meeting.typeCode != undefined) {
            meetingWithPK.typeCode = meeting.typeCode;
        } else {
            meetingWithPK.typeCode = '';
            // console.log(meetingWithPK);
        }
        
        
        pk++
        
        meetingsWithPK.push(meetingWithPK);
    });
});

// fs.writeFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/allMeetingsWithPK.json', JSON.stringify(meetingsWithPK)); 

// console.log(meetingsWithPK);
// console.log('***');
// console.log(meetingsWithPK.length);



//next steps: create table for meetings