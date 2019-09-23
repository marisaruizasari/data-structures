### Week02 Assignment Documentation
# Parse text file for AA Meetings in Manhattan 

Instructions
------

We will continue to work with the files you collected in Weekly Assignment 1. For this week, you will work with only one of the files; it will be determined by the last number of your New School ID. The last number of your ID corresponds with the AA Manhattan "zone" you are assigned. For example, if your ID is "N01234567", work with the Zone 7 file. If it is "N09876543", work with the Zone 3 file. If the last number of your New School ID ends with a "0", work with the Zone 10 file. (At the bottom of this markdown file, there's an image showing the map of the zones in Manhattan.)

1. Using Node.js, read the assigned AA text file that you wrote for last week's assignment. Store the contents of the file in a variable.

2. Ask yourself, "why are we reading this from a saved text file instead of making another http request?"

3. Study the HTML structure of this file and began to think about how you might parse it to extract the relevant data for each meeting. Using this knowledge about its structure, write a program in Node.js that will write a new text file that contains the street address for **every** row in the table of meetings in your assigned AA file. Make a decision about the [data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures) you want to use to store this data in a file, knowing that you'll be working with this data again later. 

4. Update your GitHub repository with the relevant file(s); this should include a `.js` file(s) with your code and a `.txt` or other format file(s) with the addresses, plus a `md` file with your documentation. In Canvas, submit the URL of the specific location of this work within your `data-structures` GitHub repository. **Note: this should be in a directory that contains only your work for this week.** 

## Starter Code  

```javascript
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
```

Documentation
------

### Install cheerio & store contents into object 
```javascript
// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the AA meeting text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/Week01/aa-data/m09.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);
```

### Create variables to store address components 
I first created an empty array to hold each of the final addresses, as well as empty variables for the individual lines/components of each address.

```javascript
var addresses = []

let groupName =[]
let buildingName = []
let streetAddress = []
let roomDetail = []
let streetDetail = []
let zipCode = []
```

### Push address components to variables
Next I pushed the text for each address line/component to its respective variable, specifying the 'td' table cell style and child element. For the group names and building names I was able to use .text since I wanted the entire string for the respective child element, but for the street address and all remaining address components I used .html since I needed to split on breaks. This created an issue for the street detail (&s were converted to &amp since it was reading HTML) but I was able to correct this by using .replace.

```javascript
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
 ```
 
### Loop through each address & push to array
Finally I created a loop to push each individual address to the empty addresses array.
This worked for my file since I only had four addresses to parse, but I wonder if this would be the most efficient way to parse if I had a file that had hundreds of addresses and I wasn't sure exactly how many (since this method requires specifying i<#)?
```javascript
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
```

### Create new text file with addresses
```javascript
fs.writeFileSync('/home/ec2-user/environment/data-structures/Week02/m09addresses.txt', addresses);
```
