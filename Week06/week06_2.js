// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "dsProcessBlog2",
    KeyConditionExpression: "Category = :categoryName and #dt between :minDate and :maxDate", // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#dt" : "Date"
    },
    ExpressionAttributeValues: { // the query values
        ":categoryName": {S: "Weekday, class"},
        ":minDate": {N: new Date("September 24, 2019").valueOf().toString()},
        ":maxDate": {N: new Date("October 3, 2019").valueOf().toString()}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});