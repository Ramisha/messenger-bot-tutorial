'use strict'
var status          = 'st_new_user';
var destination     = '';
var departure       = '';
var end_date        = '';
var start_date      = '';
var con_destination = '';
var con_departure   = '';
var con_end_date    = '';
var con_start_date  = '';
 var get_object;

const express    = require('express')
const bodyParser = require('body-parser')
const request    = require('request')
const app        = express()
var http = require('http')

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
    res.send('hello world i am an itinerary recommender bot !!');
    console.log('initiated');
    //res.send('lol lol');
})

// for facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {

    let messaging_events = req.body.entry[0].messaging
    // for (let i = 0; i < messaging_events.length; i++) {
        let event  = req.body.entry[0].messaging[0]
        let sender = event.sender.id

    console.log("********************************\n\n\n");
    console.log(JSON.stringify(event));
 //  console.log("\n*******\n"+JSON.stringify(res));
    console.log('\n************************************\n\n\n')



        if (event.message && event.message.text && !event.message.is_echo) {
            let initiate_temp = event.message.text
            var initiate      = initiate_temp.toUpperCase();
            //	initiate.toLowerCase()
            if (status === 'st_new_user' && (initiate === 'HI' || initiate === 'HEY')) {
                sendTextMessage(sender, "Hey I am an Itinerary recommender, do you want to start creating your itinerary ?")
                status = 'st_start';
          testGet()
	   //  sendJSONMessage(sender)
		    
		   // var test = require('api.myjson.com/bins/2gmu8');
		     var test = require('./users.json');
			console.log(test.fName + '' + test.lName);
		    
		     sendTextMessage(sender, "############################")
		     sendTextMessage(sender, test.lName)

	     
	     
		 
	// console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\n\n");
		//  console.log(testGet());
	// console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\n\n");	    
		//get_object_string = JSON.stringify(get_object)
// 		 function encode_utf8(get_object) {
// 		  return unescape(encodeURIComponent(get_object));
// 		}
		    
		    
		//sendTextMessage(sender,get_object)
            }

            if (status !== 'st_new_user' && (initiate === 'HI' || initiate === 'HEY')) {
                sendTextMessage(sender, "type start over to continue creating your itinerary ")
               // button_check(sender)
              // testGet()
                status = 'st_start';
            }


            if (status === 'st_start' && (initiate === 'NO' || initiate === 'NOP' || initiate === 'NEH')) {
                sendTextMessage(sender, "I am an itinerary recommender, simply say hi to get started")
                status = 'st_new_user';
            }

            if (initiate === 'START OVER' || initiate === 'EXIT' || initiate === 'QUIT') {

                status = 'st_start';
                sendTextMessage(sender, "Do you want to start creating your itinerary ?")

               /* destination = '';
                departure   = '';
                end_date    = '';
                start_date  = '';*/

            }

            if (status === 'st_start' && (initiate === 'YES' || initiate === 'YEAH' || initiate === 'SURE' || initiate === 'OK')) {
                status   = 'st_destination';
                initiate = '';
                sendTextMessage(sender, "Give your Destination to strat creating your itinerary")
              //  button_check(sender)
                //	datePicker(sender);
            }

            // get user input to create the itinerary

            //	let destination = event.message.text
            if (status === 'st_destination' && initiate !== '') {
                con_destination = initiate;
                sendTextMessage(sender, "your destination is : " + con_destination + "\n\nwhat is your origin ?")
                initiate = '';
                	status = 'st_departure';
            }

            if (status === 'st_departure' && initiate !== '') {
                //let departure = event.message.text
                con_departure = initiate
                status        = 'st_user_s_date';
                initiate      = '';
                sendTextMessage(sender, "your departure location is : " + con_departure + "\n\nwhen are you planning to leave ? \n date format : dd/mm/yyyy")
            }

           // let start_date = event.message.text
            if (status === 'st_user_s_date' && initiate !== '') {
            	 con_start_date = initiate;
                sendTextMessage(sender, "your departure date is : " + start_date + "\n\nwhen are you planning to return ? \n date format : dd/mm/yyyy")
                 initiate      = '';
                status         = 'st_user_e_date';
            }

           // let end_date = event.message.text
            if (status === 'st_user_e_date' && initiate !== '') {
            	con_end_date = initiate;
                //sendTextMessage(sender, "your return date is : " + con_end_date )
                sendTextMessage(sender, "your itinerary requirement  : \n\nDestination : " + con_destination + "\nDeparture : " + con_departure + "\nStart date : " + con_start_date + "\nEnd date : " + con_end_date + "\n\n\n Here is your itinerary ...")
                sendItinerary(sender)
            }
        }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
        }
    res.sendStatus(200)
})
// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAAN1nQ8Jz3MBABpQib4sZB1UnMCIobDAQ7ArZA8w9U67AD1gimvvDCkLptz7k3keOTjZBY3DKZCyPIFZApIg3zn6I5ByFbNpQkwRfD99ZAejGmElK075ygLKJvHw4XWcb1ZCyY9V5gOkxgywVVhjZCWRCPPvBXdM5G1WykZCgcxSoPQZDZD"


function sendJSONMessage(sender) {
    var messageData = testGet();
    console.log('\n\n\nsending : ' + text+'\n\n');
   request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, 
    
    function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
	
	}


function sendTextMessage(sender, text) {
    let messageData = {text: text}
    console.log('\n\n\nsending : ' + text+'\n\n');
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } 
        else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



//https://api.myjson.com/bins/1e9cv
// function to get itinerary data from back-end
function testGet() {
    return http.get({
       // host: 'jsonplaceholder.typicode.com',
       // path: '/posts'
	    
	    host: 'tbx.codegen.net',
       path: '/TravelBoxSurf//api/surf/search?templateRef=htl-tophit-aggr&sessionId=null&&bookingType=HOTE&size=6&pax=2'
    },

    function(response, sender) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        
        response.on('end', function() {
		//console.log(body[0].title)
		console.log(body)
		//sendTextMessage(sender, body.fName)
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
           
        });
        
 
    });
}


// shows a sample itinerary (with hard coded data )
function sendItinerary(sender) {  // sample itinerary view 
let messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
       
		        "elements":[
		          {
		            "title":"Attraction 1 : Hikkaduwa",
		            "item_url":"https://petersfancybrownhats.com",
		            "image_url":"http://www.srijourneys.com/wp-content/uploads/2014/08/hikkaduwa-feature.jpg",
		            "subtitle":"enjoy a memorable holiday in your life 1",
		            "buttons":[
		              {
		                "type":"web_url",
		                "url":"http://www.visitacity.com",
		                "title":"View Website"
		              },
		                           
		            ]},
		            
		            {
		            "title":"Attraction 2 : Yala",
		            "item_url":"https://petersfancybrownhats.com",
		            "image_url":"http://www.yalasafariholidays.com/images/images_main/yala_national_park/1.jpg",
		            "subtitle":"enjoy a memorable holiday in your life 1",
		            "buttons":[
		              {
		                "type":"web_url",
		                "url":"http://www.visitacity.com",
		                "title":"View Website"
		              },
		                           
		            ]},
		            
		            {
		            "title":"Attraction 3 : Kandy",
		            "item_url":"https://petersfancybrownhats.com",
		            "image_url":"http://www.asianexotica.org/img/location/kandy.jpg",
		            "subtitle":"enjoy a memorable holiday in your life 1",
		            "buttons":[
		              {
		                "type":"web_url",
		                "url":"http://www.visitacity.com",
		                "title":"View Website"
		              },
		                           
		            ]},
		            
		            {
		            "title":"Attraction 4 : Sigiriya",
		            "item_url":"https://petersfancybrownhats.com",
		            "image_url":"http://www.pearlceylon.com/images/destination/sigiriya/sigiriya-by-air.jpg",
		            "subtitle":"enjoy a memorable holiday in your life 1",
		            "buttons":[
		              {
		                "type":"web_url",
		                "url":"http://www.visitacity.com",
		                "title":"View Website"
		              },
		                           
		            ]},
		            
		            {
		            "title":"Attraction 5 : galle",
		            "item_url":"https://petersfancybrownhats.com",
		            "image_url":"http://angelstravels.com/images/attractions/Attraction_Galle/Sri-Lanka-Tours-Galle-Fort-lighthouse.jpg",
		            "subtitle":"enjoy a memorable holiday in your life 2",
		            "buttons":[
		              {
		                "type":"web_url",
		                "url":"http://www.visitacity.com",
		                "title":"View Website"
		              },
		                           
		            ]}
      ]
    }
  }
}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
	
	}

function button_check(sender) {  // sample button : not used 

    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Some text goes here",
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://www.example.com",
                        "title": "Button Title"
                    }
                ]
            }
        }
    };
    request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData,
            }
        }, function (error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        }
    )
}



// spin spin sugar
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})
