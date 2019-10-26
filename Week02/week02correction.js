// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the AA meeting text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/Week01/aa-data/m09.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// create empty array for final addresses and variables for address components
var addresses = [];


$('td').each(function(i, elem) {
    var address = new Object();
    
    if ($(elem).attr('style') == 'border-bottom:1px solid #e3e3e3; width:260px') {
    
    
    // address.groupName = ($(elem).html().split('<br>')[1].trim().split('-')[1].trim().split('</b>')[0]);
    
    address.streetAddress = ($(elem).html().split('<br>')[2].trim().split(',')[0]);
    
    // address.buildingName = ($(elem).children('h4').text().trim());
    
    // address.roomDetail = ($(elem).html().split('<br>')[2].trim().split(',')[1].trim());
    
    // address.streetDetail = ($(elem).html().split('<br>')[3].trim().split('(').pop().split(')')[0].replace(/&amp;/g, "&"));
    
    // address.zipCode = ($(elem).html().split('<br>')[3].trim().split('NY')[1].trim());
    
    addresses.push(address);
    console.log(addresses);    
        
    }

});



//create new text file with addresses 
fs.writeFileSync('/home/ec2-user/environment/data-structures/Week02/m09addressescorrectedtxt.txt', addresses);
fs.writeFileSync('/home/ec2-user/environment/data-structures/Week02/m09addressescorrected.json', JSON.stringify(addresses));
