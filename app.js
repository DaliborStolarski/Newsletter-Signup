// requiring modules
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { apiKey, idList } = require("./config.js");

// init constant app
const app = express();

// public folder with IMG and CSS
app.use(express.static("public"));

// body-parser use
app.use(bodyParser.urlencoded({ extended: true }));

// Sending signup.html to browser ASAP a request is made on localhost:3000
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//Setting up MailChimp
mailchimp.setConfig({
  // apiKey and server
  apiKey: apiKey,
  server: "us13",
});

//As soon as the sign in button is pressed execute this (based on HTML data)
app.post("/", function (req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  // const idList = idList;

  //Creating an object with the users data
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  //Uploading the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(idList, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });

    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html");
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }
  //Running the function and catching the errors (if any)
  // catch statement is executed when there is an error, if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
  console.log(`Error occurred!`);
});

// port 3000 listener
app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000, Newsletter-Signup project");
});
