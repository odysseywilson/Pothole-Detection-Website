// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/database");

 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAey2VZLt7C2Qxy07wi1NkNLCS-HamzL7w",
    authDomain: "pothole-app-7b5fc.firebaseapp.com",
    databaseURL: "https://pothole-app-7b5fc-default-rtdb.firebaseio.com",
    projectId: "pothole-app-7b5fc",
    storageBucket: "pothole-app-7b5fc.appspot.com",
    messagingSenderId: "887414964811",
    appId: "1:887414964811:web:b5ed47e9fd6397a6c9c3ce",
    measurementId: "G-1522KX17J9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();

const express = require("express");
const url = require("url");
const handlebars = require("express-handlebars");
var bodyParser = require('body-parser');
const { time } = require("console");

var app = express();
var port = 3000;
var database = firebase.database();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.engine("handlebars", handlebars({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Set handlebars helpers
var hbs = handlebars.create({});
hbs.handlebars.registerHelper("getDate", function(timestamp){
    if (timestamp){
        var timestampArr = timestamp.split(" ");
        return timestampArr[0]; 
    }
    return timestamp;
});
hbs.handlebars.registerHelper("getTime", function(timestamp){
    if (timestamp){
        var timestampArr = timestamp.split(" ");
        return timestampArr[1]; 
    }
    return timestamp;
});

app.use(express.static("public"));

//Render the homepage (all potholes)
app.get("/all_potholes", function(req, res, next){
    console.log("Running app.get('/all_potholes')");
   
    //DB request to get all potholes
    //.on("value") runs on page load, returns all children
    //database.ref("Potholes").orderByChild("Timestamp").on("value", function(snapshot){
    database.ref("Potholes").on("value", function(snapshot){
        var sortedPotholeArray = new Array();

        //Since the browser orders JSON, not Firebase, you have to put the response into an array using the forEach method
        //https://stackoverflow.com/questions/33893866/orderbychild-not-working-in-firebase talks about it
        snapshot.forEach(function(child){
            var potholeEntry = child.val();
            potholeEntry["pothole_id"] = child.key;
            sortedPotholeArray.push(potholeEntry);
        });

        //Render table in index.handlebars with just treated potholes
        res.status(200).render("index", {
            results: sortedPotholeArray
        });
    });
});

//Render the active pothole page
app.get("/active_potholes",function(req,res,next) {

    //DB request to get all potholes where treated==false
   
    //.on("value") runs on page load, returns all children
    database.ref("Potholes").orderByChild("treated").equalTo("false").on("value", function(snapshot){
        
        if (snapshot.exists()){
            // console.log(snapshot.val());
            var rows = snapshot.val();
    
            for(const[key, value] of Object.entries(rows)){
                rows[key]["pothole_id"] = key; //Adds entry to each pothole with pothole_id: "Pothole_123"
            }
            //console.log("ROWS: " + JSON.stringify(rows));
            
            //Render table in index.handlebars with just treated potholes
            res.status(200).render("index", {
                results: rows
            });
        } else{
            res.status(200).render("index");
        }
    });
    /*database.ref().child("Potholes").get().then(function(snapshot){
        if(snapshot.exists()){
            //console.log(snapshot.val()); //prints json representation of db
            
            var rows = snapshot.val();

            for(const[key, value] of Object.entries(rows)){
                rows[key]["pothole_id"] = key; //Adds entry to each pothole with pothole_id: "Pothole_123"
            }

            console.log(rows);

            res.status(200).render("index", {
                results: rows //Sends all data to index.handlebars which renders each row using maintablerow.handlebars
            });
            
        }else{
            res.status(200).send("index");
        }
    }).catch(function(error){
        res.status(500).send(error);
    });


    console.log("hello world");
    //res.status(200).send("hello world");
    //res.status(200).render("index");*/

});

app.get("/treated_potholes", function(req, res, next){
    console.log("Running app.get('/treated_potholes')");
    //DB request to get all potholes where treated==True
   
    //.on("value") runs on page load, returns all children
    database.ref("Potholes").orderByChild("treated").equalTo("true").on("value", function(snapshot){
       // console.log(snapshot.val());
        var rows = snapshot.val();

        for(const[key, value] of Object.entries(rows)){
            rows[key]["pothole_id"] = key; //Adds entry to each pothole with pothole_id: "Pothole_123"
        }
        //console.log("ROWS: " + JSON.stringify(rows));
        
        //Render table in index.handlebars with just treated potholes
        res.status(200).render("index", {
            results: rows
        });
    });
   
    /*
    EVENTUALLY YOU WILL WANT TO OPTIMIZE BY USING THESE INSTEAD OF .on("value"), 
    BE SURE TO CHANGE THIS FOR ACTIVE POTHOLES AS WELL, 
    reference https://www.softauthor.com/firebase-querying-sorting-filtering-database-with-nodejs-client/#querying-data-using-firebase-events

    //.on("child_added") runs on page load and anytime child is added, returns only newly added children
    database.ref().on("child_added", function(snapshot){
        //console.log(snapshot.key); LISTS POTHOLE NAMES
        //console.log(snapshot.val()); LISTS POTHOLES AND THEIR DATA
    });

    //.on("child_changed") runs only when a child is changed, returns only changed child
    database.ref().on("child_changed", function(snapshot){
    });

    //.on("child_removed") runs when a child is removed, returns the deleted child
    database.ref().on("child_removed", function(snapshot){
    });*/

});

function getFilteredPotholeList(filter, next){
    var filteredPotholeArray = new Array();
    
    if (filter == "treated_potholes"){
        database.ref("Potholes").orderByChild("treated").equalTo("true").on("value", function(snapshot){
            if (snapshot.exists()){
                console.log("Snapshot exists");
                snapshot.forEach(function(child){
                    var potholeEntry = child.val();
                    potholeEntry["pothole_id"] = child.key;
                    filteredPotholeArray.push(potholeEntry);
                });
                
                //Since db call happens asynchronously, we use this next function to "return" filteredPotholeArray when it is done being set
                //You can even "return" multiple things by having multiple parameters
                //In fact you should have an error variable so you can render 500 if there is an error
                next(filteredPotholeArray);
            }
        });
    }
    else if (filter == "active_potholes"){
        database.ref("Potholes").orderByChild("treated").equalTo("false").on("value", function(snapshot){
            if (snapshot.exists()){
                console.log("Snapshot exists");
                snapshot.forEach(function(child){
                    var potholeEntry = child.val();
                    potholeEntry["pothole_id"] = child.key;
                    filteredPotholeArray.push(potholeEntry);
                });
                next(filteredPotholeArray);
            }
        });
    }
    else if (filter == "all_potholes"){
        database.ref("Potholes").on("value", function(snapshot){
            if (snapshot.exists()){
                console.log("Snapshot exists");
                snapshot.forEach(function(child){
                    var potholeEntry = child.val();
                    potholeEntry["pothole_id"] = child.key;
                    filteredPotholeArray.push(potholeEntry);
                });
                next(filteredPotholeArray);
            }
        });       
    }
    //console.log("getFiltered by: " + filter);
    //console.log(filteredPotholeArray);
    return filteredPotholeArray;
};

function sortFilteredPotholeList(sortBy, filter, res){
    if (sortBy == "date"){
        getFilteredPotholeList(filter, function(filteredPotholeArray){
            filteredPotholeArray.sort(function(a,b){
                const aDefined = typeof a.Timestamp !== 'undefined';
                const bDefined = typeof b.Timestamp !== 'undefined';
                //Returns the first one that can be converted to true, otherwise returns 0 to the sort function
                return (bDefined - aDefined) || (aDefined === true && new Date(a.Timestamp) - new Date(b.Timestamp)) || 0;
            });
            res.status(200).render("index", {
                results: filteredPotholeArray
            });
        });
    }
    if (sortBy == "severity"){
        getFilteredPotholeList(filter, function(filteredPotholeArray){
            filteredPotholeArray.sort(function(a,b){
                const aDefined = typeof a.severity !== 'undefined';
                const bDefined = typeof b.severity !== 'undefined';
                //Returns the first one that can be converted to true, otherwise returns 0 to the sort function
                return (bDefined - aDefined) || (aDefined === true && a.severity - b.severity) || 0;
            });
            res.status(200).render("index", {
                results: filteredPotholeArray
            });
        });
    }
    if (sortBy == "num_reports"){
        getFilteredPotholeList(filter, function(filteredPotholeArray){
            filteredPotholeArray.sort(function(a,b){
                const aDefined = typeof a.num_reports !== 'undefined';
                const bDefined = typeof b.num_reports !== 'undefined';
                //Returns the first one that can be converted to true, otherwise returns 0 to the sort function
                return (bDefined - aDefined) || (aDefined === true && a.num_reports - b.num_reports) || 0;
            });
            res.status(200).render("index", {
                results: filteredPotholeArray
            });
        });
    }
    if (sortBy == "highway"){
        getFilteredPotholeList(filter, function(filteredPotholeArray){
            filteredPotholeArray.sort(function(a,b){
                const aDefined = typeof a.highway !== 'undefined';
                const bDefined = typeof b.highway !== 'undefined';
                console.log("A: " + a.highway + "B: " + b.highway);
                //Returns the first one that can be converted to true, otherwise returns 0 to the sort function
                return (bDefined - aDefined) || (aDefined === true && a.highway.localeCompare(b.highway, 'en', { numeric: true }) || 0);
            });
            res.status(200).render("index", {
                results: filteredPotholeArray
            });
        });
    }
}

//Sorting the tables
app.get("/sort", function(req, res, next){
    var params = url.parse(req.url, true).query;
    var filter = params["filter"];
    var sortBy = params["by"];

    try{
        sortFilteredPotholeList(sortBy, filter, res);
    } catch(error){
        res.status(500).end();
    }

});

//Render the treatment data page
app.get("/treatment_data", function(req, res, next){
    var params = url.parse(req.url, true).query;
    var potholeID = params["id"];
    
    database.ref().child("Potholes").child(potholeID).get().then(function(snapshot){

        var pothole = snapshot.val();
        pothole.pothole_id = potholeID;
        
        res.status(200).render("treatmenttable",{
            results: pothole
        });
    });
});

//Render the edit treatment page
app.get("/edit_treatment", function(req,res,next){
    var params = url.parse(req.url, true).query;
    var potholeID = params["id"];

    

    database.ref().child("Potholes").child(potholeID).get().then(function(snapshot){

        res.status(200).render("edittreatment", {
            results: snapshot.val()
        });
    });
});

//Post request to actually edit the data https://firebase.google.com/docs/database/web/read-and-write#updating_or_deleting_data
app.post("/edit_treatment", function(req,res,next){
    //console.log(req.body.potholeID);
    var newPostKey = database.ref().child("Potholes").push().key;

    var data = req.body;
    var updates = {
        treated: data.treated,
        treat_date: data.date,
        treat_weather: data.weather,
        treat_temp: data.temp,
        emp_id_website: data.empWeb,
        emp_id_app: data.empApp,
    };

    database.ref().child("Potholes").child(data.potholeID).update(updates, (error) => {
        if (error){
            console.log("ERROR in server.js: Could not make changes to database" + error);
        }
        else{
            console.log("Should be rendering treatment table");
            res.status(200).render("treatmenttable", {
                results: database.ref().child("Potholes").child(data.potholeID).get()
            });
        }
    });

});

/*app.get("/test",function(req,res,next){
    console.log("Server was called, rendering localhost:3000/test");
    res.status(200).render("treatmenttable");
});*/

app.get("/submit-pothole-treatment", function(req,res,next){
    /*When you want to get data out of the URL from a GET request do this:
        var params = url.parse(req.url, true).query;
    which will store the info in the url localhost:3000/submit-pothole-treatment?key=parameter
    You can then access these values with
        var myParameter = params["key"];
    */
  
    /*This is how you send data to the database
    If the field does not exist, it creates it. Otherwise it overwrites it
        firebase.database().ref('Potholes/Pothole_466').set({
            treatmentDate: "2/25/2021",
            treatmentTime: "14:32",
            employeeID: "12345"
        })
        */
});

/*app.get("/test",function(req,res,next) {
        firebase.database().ref('Potholes/Pothole_32').set({
          longitude: "20.0",
          latitude: "30.0"
        });
});*/

var server = app.listen(port, function(){
    console.log("Started server on port" + port)
});