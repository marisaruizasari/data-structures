### Week01 Assignment Documentation
# Request 10 HTML files for AA Meetings in Manhattan 

Instructions
------
1. Using Node.js (in Cloud 9), make a request for each of the ten "Meeting List Agenda" pages for Manhattan. **Important: show the code for all ten requests.**
```
https://parsons.nyc/aa/m01.html  
https://parsons.nyc/aa/m02.html  
https://parsons.nyc/aa/m03.html  
https://parsons.nyc/aa/m04.html  
https://parsons.nyc/aa/m05.html  
https://parsons.nyc/aa/m06.html  
https://parsons.nyc/aa/m07.html  
https://parsons.nyc/aa/m08.html  
https://parsons.nyc/aa/m09.html  
https://parsons.nyc/aa/m10.html
```

2. Using Node.js: For each of the ten files you requested, save the body as a text file to your "local" environment (in AWS Cloud9).

3. Study the HTML structure and tags and begin to think about how you might parse these files to extract relevant data for these AA meetings.

4. Update your GitHub repository with the relevant files: your js file and ten txt files, plus a md file with your documentation. In Canvas, submit the URL of the specific location of this work within your data-structures GitHub repository.

## Starter code

```javascript
// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');

request('https://parsons.nyc/thesis-2019/', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/thesis.txt', body);
    }
    else {console.log("Request failed!")}
});
```
Documentation
------
### Install npm request & create directory  
The starter code indicated to install the npm request and create a directory named 'aa-data'

```javascript
npm install request
mkdir aa-data
```

### Approach 1: Request each HTML file individually 
Since I'm new to coding, I wanted to make sure I understood the starter code and was able to use it to pull the body of each HTML file into a text file in my "local" cloud9 environment before trying to create a loop. 

I first created variables that contain each of the 10 urls, and 10 respective txt file names to be saved in the data directory. 
 
```javascript
var request = require('request');
var fs = require('fs');

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
 ```

Using the starter code, I replaced the url for the request and the file path for the fs.writeFileSync command. 

```javascript
request('https://parsons.nyc/aa/m03.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m03.txt', body);
    }
    else {console.log("Request failed!")}
});
```
I repeated this 10 times for each URL. This created 10 txt files containing each HTML file body in my cloud9 data directory. However, since this process would not be efficient in the case that there were more URLs, I wanted to explore the looping approach to expedite the process and write cleaner and shorter code. To do so, I started over with an empty aa-data directory in my cloud9 environment.

### Approach 2: Storing HTML body txt files using a loop

I first created variables for the url components: the base url which is the same for each HTML page, and the url number m01-10.

```javascript
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
```

I then tried to use a for loop using the request to store the HTML body in txt files, however since JavaScript runs asynchronously this method did not work and resulted in only one file being stored in the directory:

```javascript
for (var i=0; i<10; i++) {
    request(urlBase + urlNumber[i] + '.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/datatest/' + urlNumber[i] +'.txt', body);
    }
    else {console.log("Request failed!")}
});
}
```

Instead I created a separate function for the request that could be called upon in a later for loop: 

```javascript
function retrieveHtml(i) {
    request(urlBase + urlNumber[i] + '.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/aa-data/' + urlNumber[i] +'.txt', body);
    }
    else {console.log("Request failed!")}
});
}
```

And finally I created a for loop that called in my retrieveHtml function, which successfully saved 10 txt files in my aa-data directory with the correct HTML body for each of the 10 urls:

```javascript
for (var i=0; i<10; i++) {
    retrieveHtml(i);
}

```
