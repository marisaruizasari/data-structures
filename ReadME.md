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
### Step 1: Install npm request & create directory  
The starter code indicated to install the npm request and create a directory named 'data'

```
npm install request
mkdir data
```

### Step 2: Request each HTML file individually 
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
I repeated this 10 times for each URL. This created 10 txt files containing each HTML file body in my cloud9 data directory. However, since this process would not be efficient in the case that there were more URLs, I wanted to explore the looping approach to expedite the process and write cleaner and shorter code. 

### Step 3. Looping 

