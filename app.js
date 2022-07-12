require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const urlencoded = require("body-parser/lib/types/urlencoded");
const { json } = require("express/lib/response");

const app = express();

console.log()

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(request, response){
    response.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/af7b718103/";
    const options = {
        method: "POST",
        auth: "bryan2:1f3b340aa14fbcd0aaddb4bd6ebef220-us1"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});


app.post("/failure", function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT || 8000, function(){
    console.log("Server is running in port 8000");
});
