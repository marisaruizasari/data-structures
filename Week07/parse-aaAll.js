// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// create empty array for final addresses and variables for address components
let meetingData = [];

let location = new Object();

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
    
    
    $('tr tr tr').each(function(i, elem) {
    
    if ($(elem).attr('style') == 'margin-bottom:10px') {
         
        // Street Address Components
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
            
            // console.log('****');
            // console.log(addressDetails);
        
            // addressDetails.groupName = $(elem).html().split('<br>')[1].trim().split('-')[0].split('<b>')[1].replace(/&apos;/g, "'").trim();
            // split on (-), doens't work for all meetings but returns cleaner results for those with repetitive group names
            // addressDetails.groupName = $(elem).html().split('<br>')[1].trim().split('-')[1].trim().split('</b>')[0];
            // var streetDetail = $(elem).html().split('<td>')[0].trim().split('<br>')[3].trim().split('(').pop().split(')')[0].replace(/&amp;/g, "&");
            // // console.log(address.groupName);
            //this zip code didn't work for all - switched to the one below for parsing all 10 zones
            // addressDetails.zipCode = $(elem).html().split('<td>')[0].trim().split('<br>')[3].trim().split('NY')[1].trim();
            
        });
        
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
            // console.log("***");
            // console.log(location);
            
            location = addressDetails;
            meetingData.push(location);
    }
});
    
    
});

console.log('****');
console.log(meetingData);
console.log('****');
console.log(`Number of meeting locations in all zones: ${meetingData.length}`);

         
fs.writeFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/allZones2.json', JSON.stringify(meetingData));        
         
         
         
         
         
         
  