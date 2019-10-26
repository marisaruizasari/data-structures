// dependencies
var async = require('async');

// create blog entries array

let blogEntries = [];

class BlogEntry {
  constructor(Category, date, weekday, entry, stress, sleep, gym) {
    this.Category = {};
    this.Category.S = Category;
    this.Date = {}; 
    this.Date.S = new Date(date).toDateString();
    this.weekday = {};
    this.weekday.S = weekday;
    this.entry = {};
    this.entry.S = entry;
    this.stress = {};
    this.stress.N = stress.toString(); 
    this.sleep = {};
    this.sleep.N = sleep.toString();
    if (gym != null) {
      this.gym = {};
      this.gym.SS = gym; 
    }
    this.month = {};
    this.month.N = new Date(date).getMonth().toString();
  }
}


// write and push blog entries 

blogEntries.push(new BlogEntry('Weekend', 'September 22, 2019', "Sunday", "Today was Sunday! I worked on Major Studio Project 1", 3, 7, ["3mi run", "arms"]));
blogEntries.push(new BlogEntry('Weekday, no class', 'September 23, 2019', "Monday", "I went to Zach's office hours and finished Data Structures week 5 assignment (How is it already week 5!?)", 5, 6, ["1 mi jog"]));
blogEntries.push(new BlogEntry('Weekday, class', 'September 24, 2019', "Tuesday", "We presented our Major Studio Met projects, it was awesome to see everyone's work.", 4, 5, ["abs", "legs"]));
blogEntries.push(new BlogEntry('Weekday, class', 'September 25, 2019', "Wednesday", "I presented my week 5 assignment in Data Structures and finished my clock assignment for DVIA", 7, 5, ["3mi run", "arms"]));
blogEntries.push(new BlogEntry('Weekday, class', 'September 26, 2019', "Thursday", "I did my Major Studio reading and worked on my Adv Quant problem set on multiple regression", 2, 6));
blogEntries.push(new BlogEntry('Weekday, no class', 'September 27, 2019', "Friday", "Today I worked on Data Structures week 6 assignment, I'm still wrapping my mind around SQL vs noSQL. I've never thought so hard about what constitutes a table before", 1, 7));


// console.log(blogEntries);

// populate noSQL database with blog entries 

    
     var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-1";

    var dynamodb = new AWS.DynamoDB();
  
    async.eachSeries(blogEntries, function(value, callback) {

    var params = {};
    
    params.Item = value;   

    params.TableName = "dsProcessBlog";
    
    dynamodb.putItem(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response
    });
    
    setTimeout(callback, 1000); 
});


/* for loop - worked for populating table but did not address the 2 puts per second maximum
for (var i=0; i<blogEntries.length; i++){
    params.Item = blogEntries[i]; 
     params.TableName = "dsProcessBlog";

    dynamodb.putItem(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response
    });
    
}
*/