// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the AA meeting text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/Week01/aa-data/m09.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// create empty array for final addresses and variables for address components
var addresses = []

let groupName =[]
let buildingName = []
let streetAddress = []
let roomDetail = []
let streetDetail = []
let zipCode = []


//push address components to respective variables

// group names
$('td > b:nth-child(3)').each(function(i, elem) {
    if ($(elem).attr("style") == 'border-bottom:1px solid #e3e3e3; width:260px') {
    }
    groupName.push(($(elem).text()));
    // console.log(groupName)
    
});

// buildings
$('td > h4').each(function(i, elem) {
    if ($(elem).attr("style") == 'border-bottom:1px solid #e3e3e3; width:260px') {
    }
    buildingName.push(($(elem).text()));
    // console.log(buildingName)
    
});

// street addresses
$('td').each(function(i, elem) {
    if ($(elem).attr("style") == 'border-bottom:1px solid #e3e3e3; width:260px') {
    streetAddress.push(($(elem).html().split('<br>')[2].trim().split(',')[0]));
    // console.log(streetAddress)
    }

});

// room details
$('td').each(function(i, elem) {
    if ($(elem).attr("style") == 'border-bottom:1px solid #e3e3e3; width:260px') {
    roomDetail.push(($(elem).html().split('<br>')[2].trim().split(',')[1].trim()));
    // console.log(roomDetail)
    }    
    
});

// street details
$('td').each(function(i, elem) {
    if ($(elem).attr("style") == 'border-bottom:1px solid #e3e3e3; width:260px') {
    streetDetail.push($(elem).html().split('<br>')[3].trim().split('(').pop().split(')')[0].replace(/&amp;/g, "&"));
    // console.log(streetDetail)
    }
    
});

// zip codes
$('td').each(function(i, elem) {
    if ($(elem).attr("style") == 'border-bottom:1px solid #e3e3e3; width:260px') {
    zipCode.push(($(elem).html().split('<br>')[3].trim().split('NY')[1].trim()));
    // console.log(zipCode)
    }
    
    
});

console.log(groupName);
console.log(buildingName);
console.log(streetAddress);
console.log(roomDetail);
console.log(streetDetail);
console.log(zipCode);

//Loop through each address and push to final addresses array 
for (var i=0; i<4; i++) {
 let address = `
 ${groupName[i]}
   ${buildingName[i]}
   ${streetAddress[i]}, NY ${zipCode[i]}
   ${streetDetail[i]}
   `;
 
addresses.push(address);
 
console.log(address);
console.log(addresses);

};

//create new text file with addresses 
fs.writeFileSync('/home/ec2-user/environment/data-structures/Week02/m09addresses.txt', addresses);




// starter code 

/* 
// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('data/thesis.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// print (to the console) names of thesis students
$('h3').each(function(i, elem) {
    console.log($(elem).text());
});

// write the project titles to a text file
var thesisTitles = ''; // this variable will hold the lines of text

$('.project .title').each(function(i, elem) {
    thesisTitles += ($(elem).text()).trim() + '\n';
});

fs.writeFileSync('data/thesisTitles.txt', thesisTitles);
*/