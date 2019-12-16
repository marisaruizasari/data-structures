// dependencies
var async = require('async');
// const fs = require('fs');
// const csvjson = require('csvjson');


// var blogpostsJson;

// fs.readFile('blogposts.csv', 'utf-8', (err, fileContent) => {
//     if (err) {
//         console.log(err); // Do something to handle the error or just throw it
//         throw new Error(err);
//     }
//     blogpostsJson = csvjson.toObject(fileContent);

// });

// function log() {
//     console.log(blogpostsJson)
// }

// setTimeout(function () { console.log(blogpostsJson) }, 2000);


// create blog entries array

let blogEntries = [];

class BlogEntry {
    constructor(category, date, id, title, entry, fileName) {
        this.category = {};
        this.category.S = category;
        this.date = {};
        this.date.S = new Date(date).toISOString();
        this.id = {};
        this.id.S = id;
        this.title = {};
        this.title.S = title;
        this.entry = {};
        this.entry.S = entry;
        this.fileName = {};
        this.fileName.S = fileName;
    }
}


// write and push blog entries


blogEntries.push(new BlogEntry('Data Structures', 'August 30, 2019', "1", "Week 01 Assignment - Request 10 HTML files for AA Meetings in Manhattan", `I first created variables for the url components: the base url which is the same for each HTML page, and the url number m01-10.

I then tried to use a for loop using the request to store the HTML body in txt files, however since JavaScript runs asynchronously this method did not work and resulted in only one file being stored in the directory.

Instead I created a separate function for the request that could be called upon in a later for loop.

And finally I created a for loop that called in my retrieveHtml function, which successfully saved 10 txt files in my aa-data directory with the correct HTML body for each of the 10 urls.`, "week01.png"));

blogEntries.push(new BlogEntry('Data Structures', 'September 9, 2019', "2", "Week 02 Assignment - Parse text file for AA Meetings in Manhattan", `I first created an empty array to hold each of the final addresses, as well as empty variables for the individual lines/components of each address.

Next I pushed the text for each address line/component to its respective variable, specifying the 'td' table cell style and child element. For the group names and building names I was able to use .text since I wanted the entire string for the respective child element, but for the street address and all remaining address components I used .html since I needed to split on breaks. This created an issue for the street detail (&s were converted to &amp since it was reading HTML) but I was able to correct this by using .replace.

Finally I created a loop to push each individual address to the empty addresses array. This worked for my file since I only had four addresses to parse, but I wonder if this would be the most efficient way to parse if I had a file that had hundreds of addresses and I wasn't sure exactly how many (since this method requires specifying i<#)? `, 'week02.png'))

blogEntries.push(new BlogEntry('Data Structures', 'September 16, 2019', "3", "Week 03 Assignment - Geocode addresses for AA Meetings in Manhattan", `I first installed the request, async, and dotenv dependencies as indicated in the starter code. I created a .env file in my Week03 directory to store my api key, and created a .gitignore file to prevent the .env file from being pushed to github.

Next I loaded the json file from week02 assignment that contained each of the addresses from the parsed m09 txt file. I created an addresses array and pushed the street addresses from the json file. Finally I created an empty array to store the final geocoded addresses.

Using the starter code, I created a string for the api query that specified the street address, city, and state for the request.

I created an empty object to hold the components of interest, and rather than pull all of the output geocodes, I requested only the street address, latitude, and longitude. I then pushed the address objects to the emtpy meetingsData array. Here we use the setTimeout function to address the asynchronous nature of javascript, though I still don't fully understand when and where asynchronisity is an issue.

Lastly, I saved the meetingsData array containing the address objects to a json file in my Week03 directory.

I was able to save a json file with the geocoded addresses for each of the AA locations, however this file doesn't contain duplicate addresses for each meeting time within each location. I imagine that for our final map we will need this information, so my next steps are to work on creating a file that has each specific meeting time and location.,`, 'week03.png'))


blogEntries.push(new BlogEntry('Data Structures', 'September 22, 2019', "4", "Week 04 Assignment Part A - Draw data model for SQL database", `I created an outline of my database structure using a normalized data approach. This approach reduces redundancy and minimizes error by creating multiple tables that are linked by primary keys (uniquely identifying field) and foreign keys (field in a table that references another table's primary key). The structure of my database focuses on individual meetings (stored in the meeting data table) as the smallest non-repeating unit. The meeting data table references the address data, group data, special interest data, and meeting type data tables. The address data table also references the zone data table. This outline represents my ideal structure for the final database, however it should be noted that the resulting table in this assignment does not match this outline since I currently only have address data and not the other meeting details in my json file. See final notes below for more information.`, "week04-1.png"))


blogEntries.push(new BlogEntry('Data Structures', 'September 23, 2019', "5", "Week 04 Assignment Part B - Create a table within aa meetings database", `I first installed dependencies and referenced my .env file containing my host link and password. I then connected to the AWS RDS postgres database that I created in the setup and preparation part of the assignment, referencing the host link and password stored in my .env file. Note here that the port # does not change (is a constant).

Finally I created an empty table named 'aalocations', with column headers for street address, latitute, and longitude. Here we also needed to specify the data type (eg. 'double precision') to ensure that the values retained their intended type (lat/long shouldn't get rounded etc.). Here I also used the 'DROP TABLE' sample code to delete tables after each test until I was satisfied with my results.

I next read my json file containing the geocoded addresses from week03 assignment and parsed the file, saving each address in a new addressesForDb variable. For each address in the addressesForDb array, I queried the street address, latitute, and longitude and inserted it into the aalocations table generated in part 2.

Using the starter code, I checked the contents of the aalocations table, console.logging only the row contents.

<strong> Final Notes </strong>

For this assignment I was able to generate a table and store three elements: address, latitude, and longitude. However, as I noted in Week03 assignment, and as reflected in my Part One database structure diagram, I will eventually need to store additional information about each individual meeting (start and end time, meeting type, special interests etc).
This week I attempted to pull in this addtiional information by going back to my Week02 parsed json file and regenerating my Week03 geocoded json file. I came across two issues in this attempt:
1. I had trouble parsing of the additional information from the html file from Week01 - I was able to parse the following information:group name, street address, building name, room details, street details, and zip code, but was not able to parse the remaining desired information: meeting type, special interest, wheelchair accessibility, start time, and end time. This was due to the fact that this information is contained in a 'td' element with a different 'style' attribute.
2. I had trouble creating one json file that contained both the geocoded information (lat/long) as well as the additional information that I was able to parse. Thus for the time being I used only my json file that contained address, lat, and long which is what is reflected above in the assignemnt resutls.
My next steps are to pull the remaining infromation into one json file and generate multiple tables that follow my database structure diagram.`, 'week04-2.png'))


blogEntries.push(new BlogEntry('Data Structures', 'October 1, 2019', '6', "Week 05 Assignment Part A - Draw data model for noSQL DynamoDB database", `For this assignment I wanted to play around with partition and sort key combinations, and chose to create a week of mock blog enrtries using Sunday-Friday of this week. Here I am recording information about my daily activities at school, as well as my stress and sleep patterns, and physical activity. My denormalized data model treats each blog entry as its own entity that can contain a range of components (enrty text, stress level, hours of sleep, gym activities). It is not necessary for each entry to have all of the components, and thus this model gives the database and entries more flexibility. Each of the colored rectangles represents one blog entry.
The model represents groupings by primary key using color (weekday with no class = orange, weekday with class = blue, weekend = green), and repsents the date sort key through layering (top layer representing the most recent date within the pk category). The grey rectangle at the top represents one document containing an array of objects of each of the blog entries (colored arrows flow from each entry to this document).`, "week05-1.png"))

blogEntries.push(new BlogEntry('Data Structures', 'October 2, 2019', '7', "Week 05 Assignment Part B - Create and populate DynamoDB database", `I adapted the starter code to create constructors for my blogEntries array. Here I am including the category pk (string) and date sk (string), as well as weekday (string), entry (string), sleep (N), stress (N), gym (double string), and month (N).

I then wrote six mock blog entries and pushed them to my blogEntries array. I console logged the results to make sure everything was added to the array correctly (console logging is becoming my best friend).

I started by updating permissions for my Cloud9 EC2 instance to be able to access DynamoDB. Here we took extra precaution and did not use an access key for security reasons (we don't want this ending up on GitHub!).

Then, I used putItem to populate the dsProcessBlog DynamoDB database I created in the setup and preparation step. Here we had two key challenges: 1. we needed to iterate over all the entries to populate the table in a loop, 2. we needed to not attempt more than 2 puts per second.

This was the most challenging step for me coding wise and conceptually. I started by creating a for loop to iterate over the blogEntries array, which worked and populated the table with my entries, but did not address the number of puts per second.

I scratched this idea, and turned to async. To address the puts per second, I wanted to use the setTimeout method we used last week. I referenced my week04b.js script to pull the async.eachSeries and setTimeout callback code.

My biggest challenge here was adapting the code to fit the goals of this week - I got confused with the input for the params.Item component, and kept try to set it to blogEntries which would return an error, or blogEntries[0] which would return only the first blog entry in the array. Since I'm new to javascript I didn't see that the 'value' argument needed to be added since this is the 'iteratee' (equivalent to i in a for loop). My final async.eachSeries code block was able to populate my table with all 6 entries using setTimeout`, "week05-2.png"))

blogEntries.push(new BlogEntry('Data Structures', 'October 14, 2019', "8", "Week 07 Assignment - Parse All Zones", `The structure of my final json should be an array of objects for each unique location+group combination, with nested set of meeting instances for each location+group combination. I first created an empty array to hold the final data, and empty object to hold each unique location+group information. I then created an array of file numbers and looped through this array to parse all of the zones and write to one json file containing all locations & meetings. I created an empty address details object to hold each object shell (location + nested meeting instance) and went three table rows deep to parse location information from the first td in that row. I created an empty array to hold the meeting instances and parsed meeting instance information from the second td in that row. I then assigned a meeting property to my shell object (address details) and set it equal to my array of meeting instances. Finally, for each tr that I was targeting, I set the empty locations object equal to my address details object, and pushed each of these objects to the final meeting data array that I declared at the beginning of the script. I wrote this array to a json file (allZones2).`, "week07.png"))


blogEntries.push(new BlogEntry('Major Studio', 'September 24, 2019', "9", "First Major Studio Project", `For my first major studio project, I created a scatter plot of sculpture height vs. gender using the Met's artwork tags. Sculptures were first filtered using the keywords "male" and "female", and then assigned a height value from the Met's full CSV file. To parse the heights, I used a regular expression to match the pattern of height inputs (some were in centimeters, others in inches etc.). This was my first time using D3 and using regular expressions, so although the final result is quite basic, I was really pleased with the outcome.`, "ms-scatter.png"));
blogEntries.push(new BlogEntry('Major Studio', 'October 1, 2019', "10", "Qualitative Sketches 1", `The qualitative unit focused on "non-numerical" information, such as text or images. For this unit I decided to explore the sculpture images further. My initial mockup included a page for each sculpture material category, with information about the main locations of origin for sculptures of the given material, as well as example images of sculptures of varying size.`, "ms-qual-sketch2.png"));
blogEntries.push(new BlogEntry('Major Studio', 'October 15, 2019', "11", "Second Iteration of Qualitative", `My second iteration of the qualitative visualization sketch included a height comparison "generator". The idea was to have a slot machine type of game, where users could cycle through to random sculptures of different sized and compare them by relative height. While this was closer to the final layout that I ended up going with, I had to do a lot of tweaking and major editing of the photos before I could actually code this.`, "ms-qual-sketch.png"));
blogEntries.push(new BlogEntry('Major Studio', 'October 29, 2019', "12", "Interactivity mockup", `The next unit focused on interactivity. Although my first two projecs also included basic user interactivity (tooltip and multiple buttons to simulate a slideshow/carousel) I wanted the interactive unit project to focus much more heavily on additional interactive features that could be layered. Here I created a mockup of clickable bar charts that change based on a range input and display information about a given material when clicked on.`, "mockup-dark.png"));
blogEntries.push(new BlogEntry('Major Studio', 'November 5, 2019', "13", "Addtitional Interactivity Work", `This week I created my final interactivity sketches. I kept the range slider features and added more to the beginning of the visualization to help the user navigate the page and understand the interactivity features.`, "ms-interactive-mockup.png"));
blogEntries.push(new BlogEntry('Major Studio', 'November 11, 2019', "14", "Final Interactive Project", `The final interactive project included this range slider controlled bar chart, created using D3 and the D3-simple-slider library. Users can filter by sculpture height to view the breakdown of sculptures by materials (both count and percentages)`, "ms-range-bar.gif"));
blogEntries.push(new BlogEntry('Major Studio', 'December 8, 2019', "15", "Height Comparison", `Here I'm showing cumulative work from both the interactive and "new contexts" unit. The final height comparison feature ended up including a constant object for comparison based on the height of the tallest selected sculpture. For example, sculptures between 2.5-6 cm are compared to the height of a thumbtack, while sculptures between 25-75 cm are compared to a basketball.`, "ms-compare.gif"));
blogEntries.push(new BlogEntry('Major Studio', 'December 10, 2019', "16", "Explore all Sculpture Images", `The final project also included a section where users can explore images of all human sculptures filtered by height and sculpture material. I added an interactive magnification hover feature that allows users to inspect the sculptures in more detail using the blowup.js library. `, "ms-images.gif"));

blogEntries.push(new BlogEntry('DVIA', 'September 18, 2019', "17", "Visualizing Time Sketches", `Our first assignment focused on representing time data with different retinal variables. Here I sketched three different options for combining date information including hours, minutes, seconds, days, weekday, month, and season.  While I didn’t end up fully coding these as they are displayed in the sketches, I was really happy with how they turned out as preliminary ideas. In the following weeks’ posts I show a few of the end results.`, "hybrid-sketches.png"))
blogEntries.push(new BlogEntry('DVIA', 'September 25, 2019', "18", "Alopecia Sketch", `For this coded sketch, I used p5 and svgs to map time elements to retinal variables. I chose to create a sketch related to hair loss in a less conventional sense (we usually talk about it in the context of head hair) since Alopecia is a big part of my life and losing my eyebrows and eye lashes has been the most challenging part. My alopecia goes through seasonal changes (I tend to lose both head and facial hair during the fall/winter), so I thought this could be an interesting and slightly comical reflection piece.

Here the brow furrow moves left to right based on season, eyelashes fade throughout the month, eyebrow fill fades throughout the year, eyebrow texture fades throughout the moon cycle, tear falls to bottom of the page throughout the month.`, "alopecia.gif"))
blogEntries.push(new BlogEntry('DVIA', 'September 26, 2019', "19", "Solar Sketch", `This time visualization also maps time elements to retinal variables. Here the diameter of the white moving particles increases throughout the moon cycle and the yellow ‘planet’ moves from top left corner to bottom right corner throughout the month. I really like the gradient sunset-like background. For this visualization the background is static, but I would love to create something in the future that includes a gradient that changes over time, mimicking the effect of a sunset.`, 'sunset.gif'))
blogEntries.push(new BlogEntry('DVIA', 'September 27, 2019', "20", "City Skyline", `For my final time visualization, the background color changes based on season, city skyline moves from left to right throughout week, diameter of red circle increases/decreases and moves up/down throughout moon cycle. I adapted this to a date sketch from a prior clock sketch because I thought it was better suited to show longer time periods.`, "city.gif"))
blogEntries.push(new BlogEntry('DVIA', 'October 2, 2019', "21", "W.E.B. DuBois Presentation", `This week I gave a presentation on W.E.B. DuBois, covering both his civil rights activism and data visualization work. For this presentation I referenced the book “Visualizing Black America”, which showcases DuBois work for the 1900 Paris Exposition and includes many of his ‘data portraits’. His work is incredibly striking both in its content and form. It humanizes the experience of black Americans under Jim Crow law and illustrates great detail through hand crafted charts and graphs using forms that were groundbreaking for their time.`, "dubois.png"))
blogEntries.push(new BlogEntry('DVIA', 'October 16, 2019', "22", "Nuclear Administrations", `For our second major project, we were tasked with visualizing nuclear testing data and finding an external data source to complement this information. My first idea was to create a bar chart showing the type of nuclear testing each year between 1945 - 2010, as well as the given administration and political affiliation of the US president at the time. Though this sketch does reflect the real data, I did not end up coding this in p5. (Here I’m using tableau and illustrator).`, "nuclear-presidents.png"))
blogEntries.push(new BlogEntry('DVIA', 'October 23, 2019', "23", "Nuclear Lethal Power", `My next iteration of the nuclear data focused on atmospheric tests conducted by 5 nuclear powers: USSR, United Kingdom, United States, China, and France. Here the toggle for each country displays the population for each country and the number of people that could have been killed (theoretically) from their atmospheric testing each year based on the number of people who died per KiloTon in the only two times that nuclear bombs have been used in combat (Hiroshima & Nagasaki in 1945).`, "nuclear-bar.png"))
blogEntries.push(new BlogEntry('DVIA', 'November 6, 2019', "24", "Nuclear Death Count in 6 Major US Cities", `For the final nuclear data assignment, I created a visualization that includes urban population density data and illustrates the number of fatalities that would occur if a bomb were to be dropped on a given city. The cities span across the US, and include San Francisco, Chicago, New York, Los Angeles, Houston, and Washington DC. The combined data are from the Johnstons Archive on nuclear testing, and the Nuke Map project by Alex Wellerstein.`, "nuclear-final.gif"))
blogEntries.push(new BlogEntry('DVIA', 'December 5, 2019', "25", "Earthquake Hotspotting", `For the final Data Visualization and Information Aesthetics assignment we are using live earthquake data from the USGS. This dataset includes all global seismic activity and provides information on the magnitude, depth, and location of each seismic reading. Here I decided to generate a dynamic “hotspot” finder for major cities with the most seismic activity. The idea is to identify the top 10 cities with populations over 500,000 that have the most seismic activity within a 50 km range. Looking at the most recent monthly data, the top 10 cities are: Mexicali, MX; San Jose, US; San Francisco, US; Oklahoma City, US; Seattle, US; Los Angeles, US; San Diego, US; Tijuana, MX; and Portland, US.
`, "eq.png"))

blogEntries.push(new BlogEntry('Statistics', 'September 24, 2019', "26", "Linear Regression - School Level Variation in Academic Performance", `As a consultant to the California Department of Education, I was tasked with analyzing data for 400 randomly selected elementary schools across the state in order to understand the predictors of school level variations in academic performance. In this study, the dependent variable academic performance was measured by school level standardized test scores (variable name – acadperf). Academic performance ranged from 369 to 940 across the study sample, with a mean school score of 648 and standard deviation of 142. Within the study sample dataset, fourteen additional indicators of student body and school level characteristics were avaialble for analysis. Two identifying variables of school number and district number were also included.

Using a sequential modeling strategy, I built a regression model that predicts school performance based on five of the available variables: percent student eligibility for free and reduced lunch (variable name - meals), percent of parents without a high school diploma (not_hsg), percent of parents that attended graduate school (grad_sch), percent of teachers with emergency credentials (emer), and percent english language learners (ell). This hierarchical modeling approach (rather than a stepwise approach) builds off of theory supported in the literature on elementary educational outcomes, and allows for better generalizability of the final model.`, "lin1.png"))

blogEntries.push(new BlogEntry('Statistics', 'October 17, 2019', "27", "Moderation", `Based on the change in R2, with the product term, is the interaction statistically significant? (HINT: Report the change in R2 and its significance.)
Yes, the interaction is statistically significant. R squared changed from 0.1663 in the main effects model to 0.2061 in the interaction model. The change in R squared was statistically significant, p value = 4.764e-12, so we can safely reject the null hypothesis.
b.  Which other statistic can we use in this case to tell us whether this
      interaction is statistically significant?
	We can also use the t-statistic to tell whether the interaction is statistically significant.
c.	What does the sign of the b-weight associated with the product term tell us about the relationship between endurance and age at different levels of exercise?
The sign (+) of the b-weight associated with the product term tells us that the relationship between endurance and age is moderated by exercise – as one’s history of vigorous exercise increases, the strength of the relationship between age and endurance decreases.
d.	Based on this model, draw a conclusion with respect to question (3) above.
The relationship between endurance and age is moderated by one’s history of vigorous exercise.`, "mod.png"))

blogEntries.push(new BlogEntry('Statistics', 'November 4, 2019', "28", "Logistic Regression", `The sinking of the RMS Titanic after its collision with an iceberg on the night of April 14th, 1912 is one of the largest and most famous commercial shipwrecks in history. The ship held over 2,200 passengers, of which more than 1,500 died (Tikkanen, 2019). Before its intended voyage from Southampton, England to New York City on April 10th, the ship gained a reputation for being one of the biggest and safest ships of its time. Built for comfort and leisure and intended to carry many wealthy first-class passengers, the ship had luxurious amenities, yet only enough lifeboats to fit roughly half of the ship’s passengers (Fowler, 2019).

The ship carried a wide range of passengers including those in first, second, and third class; both men and women; and people of all ages, from infants to the elderly. While only about a third of passengers survived, was the probability of survival equal for all passengers? In this assignment, we explore this question by building a logistic regression model that predicts survival of the Titanic shipwreck based on select passenger characteristics.

My final logistic regression model has an accuracy of 79.43%, and predicts survival based on five variables: whether the passenger is female, if the passenger has a 3rd class ticket, the age of the passenger, the number of spouse/siblings the passenger has on board, and whether the passenger boarded in Cherbourg.

In this model, the odds of surviving increases by a factor of 11.99 for female passengers compared to male passengers. The odds of surviving decreases by a factor of 0.18 for passengers with 3rd class tickets compared to those with 2nd or 1st class tickets. For every one unit increase in age, the odds of surviving decreases by a factor of 0.97. For every one unit increase in the number of spouse/siblings on board, the odds of surviving decreases by a factor of 0.74. The odds of surviving increases by a factor of 1.87 for passengers who embark at Cherbourg, compared to passengers who embark at Queenstown or Southampton.`, "log1.png"))

blogEntries.push(new BlogEntry('Statistics', 'December 5, 2019', "29", "Factor Analysis - KMO & Bartlett's", `The Kaiser-Meyer-Olkin measure of sampling adequacy tests the amount of common variance in the data set and represents the ratio of the squared correlation between variables to the squared partial correlation between variables. Values closer to 1 indicate that the sum of partial correlations is small compared to the sum of correlations, meaning that factor analysis is appropriate (will result in distinct/reliable factors). Since our KMO statistics are all above 0.7 (overall KMO = 0.9) we can be confident that factor analysis is appropriate for this dataset.

The determinant of the correlation matrix helps identify potential issues of multicollinearity between variables in a dataset. It describes the “area” of the data and ranges between 0 (variables are completely correlated) and 1 (zero correlation between variables). Though we want variables to correlate enough to form distinct and reliable factors, too much correlation between variables (multicollinearity) can make it difficult to isolate the unique contributions of each variable to a factor. Generally, determinant values greater than 0.00001 are considered acceptable in factor analysis. Here our determinant value is 0.017 > 0.00001, therefore multicollinearity does not appear to be of concern.

Bartlett’s test of sphericity tests the null hypothesis that there is no overlap between the variables (tests whether the correlation matrix is significantly different from an identity matrix, in which all variables are completely independent [zero correlation between variables]). Since we need relationships between variables to run a factor analysis, we want a significant (less than 0.5) p value upon which we can reject the null hypothesis. Here we can safely reject the null since the Bartlett’s test returned a p value of 0, indicating that a factor analysis is appropriate for the data and set of variables.`, "factor1.png"))

blogEntries.push(new BlogEntry('Statistics', 'December 6, 2019', "30", "Exploratory Factor Analysis", `Factor 1 represents 3.14 out of 9 variables, and therefore explains 35% of the variance (3.14/9 = 0.35). Factor 2 represents 2.67 out of 9 variables, and therefore explains 30% of the variance (2.67/9 = 0.3). Together, the two factors explain 65% of the variance.
The factors did not achieve simple structure as two of the items in the rotated analysis (17 & 21 highlighted in blue below) had loadings greater than 0.4 for both factors. The unrotated analysis had four items loading greater than 0.4 for both factors (13, 14, 18, & 19), and a fifth item that was close to this cutoff point (item 20). The unrotated analysis had negative loadings for factor 2.`, "factor2.png"))



// console.log(blogEntries);

// populate noSQL database with blog entries


var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

async.eachSeries(blogEntries, function (value, callback) {

    var params = {};

    params.Item = value;

    params.TableName = "process-blog-final";

    dynamodb.putItem(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
    });

    setTimeout(callback, 1000);
});


// blogEntries.push(new BlogEntry('DVIA', 'September 22, 2019', "Sunday", "Today was Sunday! I worked on Major Studio Project 1", "code sample goes here"));
// blogEntries.push(new BlogEntry('Data Structures', 'September 23, 2019', "Monday", "I went to Zach's office hours and finished Data Structures week 5 assignment (How is it already week 5!?)", "code sample goes here"));
// blogEntries.push(new BlogEntry('Major Studio', 'September 24, 2019', "Tuesday", "We presented our Major Studio Met projects, it was awesome to see everyone's work.", "code sample goes here"));
// blogEntries.push(new BlogEntry('Statistics', 'September 25, 2019', "Wednesday", "I presented my week 5 assignment in Data Structures and finished my clock assignment for DVIA", "code sample goes here"));
// blogEntries.push(new BlogEntry('DVIA', 'September 26, 2019', "Thursday", "I did my Major Studio reading and worked on my Adv Quant problem set on multiple regression", "code sample goes here"));
// blogEntries.push(new BlogEntry('Data Structures', 'September 27, 2019', "Friday", "Today I worked on Data Structures week 5 assignment, I'm still wrapping my mind around SQL vs noSQL. I've never thought so hard about what constitutes a table before", "code sample goes here"));
// blogEntries.push(new BlogEntry('Major Studio', 'September 28, 2019', "Saturday", "Today I rested", "code sample goes here"));

// blogEntries.push(new BlogEntry('Major Studio', 'September 29, 2019', "Sunday", "I worked on my DVIA presentation and data structures assignment 6. I went to an exercise event in Union Square Park with my friend Annabelle", "code sample goes here"));
// blogEntries.push(new BlogEntry('Data Structures', 'September 30, 2019', "Monday", "I spent the day at the 16th st. library working on my quant problem set. It ended up being much longer than I thought it would", "code sample goes here"));
// blogEntries.push(new BlogEntry('Major Studio', 'October 1, 2019', "Tuesday", "We presented our ideas for Major Studio project 2, I decided to continue working with the sculptures data.", "code sample goes here"));
// blogEntries.push(new BlogEntry('DVIA', 'October 2, 2019', "Wednesday", "I presented on WEB Debois in DVIA, I really enjoyed learning more about him and talking about his work and legacy.", "code sample goes here"));
// blogEntries.push(new BlogEntry('Data Structures', 'October 3, 2019', "Thursday", "I lead reading discussion in Major Studio", "code sample goes here"));
// blogEntries.push(new BlogEntry('Statistics', 'October 4, 2019', "Friday", "I went to Zach's office hours and worked on Major Studio", "code sample goes here"));
// blogEntries.push(new BlogEntry('Major Studio', 'October 5, 2019', "Saturday", "Another day spent at the library. I tried to parse my original txt files for the data structures aa project for addtional information about meetings... it wasn't successful", "code sample goes here"));
