// // npm install request
// // mkdir data

var request = require('request');
var fs = require('fs');

// variables for url components:

var urlBase = 'https://parsons.nyc/aa/'

var urlNumber = [
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
    
// create function for HTML request that can be called upon in a later loop:

function retrieveHtml(i) {
    request(urlBase + urlNumber[i] + '.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/aa-data/' + urlNumber[i] +'.txt', body);
    }
    else {console.log("Request failed!")}
});
}

// callback the retrieveHtml function and iterate 10 times 
for (var i=0; i<10; i++) {
    retrieveHtml(i);
}


/* <-------- starter code provided with assignemnt 

npm install request
mkdir data


var request = require('request');
var fs = require('fs');

request('https://parsons.nyc/thesis-2019/', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/thesis.txt', body);
    }
    else {console.log("Request failed!")}
});


----------> end starter code */

/* <------- first try using starter code on each url 

var urls = [
    'https://parsons.nyc/aa/m01.html',  
    'https://parsons.nyc/aa/m02.html',  
    'https://parsons.nyc/aa/m03.html',  
    'https://parsons.nyc/aa/m04.html',  
    'https://parsons.nyc/aa/m05.html',  
    'https://parsons.nyc/aa/m06.html',  
    'https://parsons.nyc/aa/m07.html',  
    'https://parsons.nyc/aa/m08.html',  
    'https://parsons.nyc/aa/m09.html',  
    'https://parsons.nyc/aa/m10.html'
    ]
    
    var fns =[
    '/home/ec2-user/environment/data/m01.txt', 
    '/home/ec2-user/environment/data/m02.txt', 
    '/home/ec2-user/environment/data/m03.txt', 
    '/home/ec2-user/environment/data/m04.txt', 
    '/home/ec2-user/environment/data/m05.txt', 
    '/home/ec2-user/environment/data/m06.txt', 
    '/home/ec2-user/environment/data/m07.txt', 
    '/home/ec2-user/environment/data/m08.txt', 
    '/home/ec2-user/environment/data/m09.txt', 
    '/home/ec2-user/environment/data/m10.txt'
    ]
    
request('https://parsons.nyc/aa/m03.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m03.txt', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m04.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m04.txt', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m05.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m05.txt', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m06.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m06.txt', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m07.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m07.txt', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m08.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m08.txt', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m09.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m09.txt', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m10.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m10.txt', body);
    }
    else {console.log("Request failed!")}
});

end first try -------> */