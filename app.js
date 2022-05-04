const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const urlencoded = require("body-parser/lib/types/urlencoded");
const { json } = require("express/lib/response");

const app = express();

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
        auth: "bryan1:c32c2b7e719195561baba3adfe19606b-us1"

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

app.listen(3000, function(){
    console.log("Server is running in port 3000");
});


// API Key
// c32c2b7e719195561baba3adfe19606b-us1

// List/Audience ID
// af7b718103