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
            
            //use this if end up looping through all files
            // var zone = fileNumber[i].match(/\d+/);
            // addressDetails.Zone = zone[0];
            
            var zone = file.match(/\d+/);
            addressDetails.zone = zone[0];
            
            addressDetails.groupName = $(elem).html().split('<br>')[1].trim().split('-')[0].split('<b>')[1].replace(/&apos;/g, "'").trim();
           
            // split on (-), doens't work for all meetings but returns cleaner results for those with repetitive group names
            // addressDetails.groupName = $(elem).html().split('<br>')[1].trim().split('-')[1].trim().split('</b>')[0];
            // // console.log(address.groupName);
            
            addressDetails.streetAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
          
            addressDetails.buildingName = ($(elem).find('h4').text().trim());
            
            addressDetails.roomDetail = $(elem).html().split('<br>')[2].trim().split(',')[1].trim();
            
            addressDetails.streetDetail = $(elem).html().split('<td>')[0].trim().split('<br>')[3].trim().split('(').pop().split(')')[0].replace(/&amp;/g, "&");
            
            //this zip code didn't work for all - switched to the one below for parsing all 10 zones
            // addressDetails.zipCode = $(elem).html().split('<td>')[0].trim().split('<br>')[3].trim().split('NY')[1].trim();
            
            var zipCode = $(elem).text().match(/\d{5}/);
            
            if (zipCode != null && zipCode != undefined){
                addressDetails.zipCode = zipCode[0]
            };
            
            addressDetails.details = $(elem).find('div').text().trim();
            
            
            var wheelChair = $(elem).text().match(/(Wheelchair access)/);
            var ada = false;
            
            if (wheelChair != null && wheelChair != undefined) {
                ada = true
            };
            
            addressDetails.ada = ada;
            
            //this didnt work for all files, switched to above for all 10 zones
            // if ($(elem).html().split('<span style="color:darkblue; font-size:10pt;">')[1].split('</span>')[0].split('<img src="../images/wheelchair.jpg" alt="Wheelchair Access" width="20" vspace="5" hspace="10" align="absmiddle">')[1].trim() == 'Wheelchair access') {
            //     ada = true 
            // };
            
        });
        
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
            // // console.log(meetingInfo);
            // console.log(meetingInfoEach);
            
            //for each meeting time, split into array by white spaces, and create meeting object to hold components from array position
            for (var i = 0; i<meetingInfoEach.length; i++) {
            
            var meetingInfoEachSplit = meetingInfoEach[i].split(' ');
            // console.log("****");
            // console.log (meetingInfoEachSplit);
            
            var meeting = new Object();
                
                meeting.weekDay = meetingInfoEachSplit[0];
                meeting.startTime = meetingInfoEachSplit[2];
                meeting.endTime = meetingInfoEachSplit[5];
                meeting.amPm = meetingInfoEachSplit[3];
                meeting.typeCode = meetingInfoEachSplit[9];
    
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

// console.log('****');
// console.log(meetingData);
console.log('****');
console.log(`Number of meeting locations in all zones: ${meetingData.length}`);

         
fs.writeFileSync('/home/ec2-user/environment/data-structures/Week07/jsonFiles/allZones.json', JSON.stringify(meetingData));        
         
         
         
         
         
         
  