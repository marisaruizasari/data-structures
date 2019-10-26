// dependencies
var async = require('async');

// create blog entries array

let blogEntries = [];

class BlogEntry {
  constructor(Category, date, weekday, entry, stress, sleep, gym) {
    this.Category = {};
    this.Category.S = Category;
    this.Date = {}; 
    this.Date.N = new Date(date).valueOf().toString();
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
blogEntries.push(new BlogEntry('Weekday, no class', 'September 27, 2019', "Friday", "Today I worked on Data Structures week 5 assignment, I'm still wrapping my mind around SQL vs noSQL. I've never thought so hard about what constitutes a table before", 1, 7));
blogEntries.push(new BlogEntry('Weekend', 'September 28, 2019', "Saturday", "Today I rested", 3, 8));

blogEntries.push(new BlogEntry('Weekend', 'September 29, 2019', "Sunday", "I worked on my DVIA presentation and data structures assignment 6. I went to an exercise event in Union Square Park with my friend Annabelle", 2, 8, ["core", "yoga"]));
blogEntries.push(new BlogEntry('Weekday, no class', 'September 30, 2019', "Monday", "I spent the day at the 16th st. library working on my quant problem set. It ended up being much longer than I thought it would", 5, 7));
blogEntries.push(new BlogEntry('Weekday, class', 'October 1, 2019', "Tuesday", "We presented our ideas for Major Studio project 2, I decided to continue working with the sculptures data.", 6, 6));
blogEntries.push(new BlogEntry('Weekday, class', 'October 2, 2019', "Wednesday", "I presented on WEB Debois in DVIA, I really enjoyed learning more about him and talking about his work and legacy.", 7, 5, ["3mi run"]));
blogEntries.push(new BlogEntry('Weekday, class', 'October 3, 2019', "Thursday", "I lead reading discussion in Major Studio", 2, 8));
blogEntries.push(new BlogEntry('Weekday, no class', 'October 4, 2019', "Friday", "I went to Zach's office hours and worked on Major Studio", 2, 7, ["3mi run"]));
blogEntries.push(new BlogEntry('Weekend', 'October 5, 2019', "Saturday", "Another day spent at the library. I tried to parse my original txt files for the data structures aa project for addtional information about meetings... it wasn't successful", 5, 8));

// console.log(blogEntries);

// populate noSQL database with blog entries 

    
     var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-1";

    var dynamodb = new AWS.DynamoDB();
  
    async.eachSeries(blogEntries, function(value, callback) {

    var params = {};
    
    params.Item = value;   

    params.TableName = "dsProcessBlog2";
    
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