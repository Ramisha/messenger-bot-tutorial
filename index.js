'use strict'
var status = 'st_new_user' ;
var destination;
var departure;
var end_date;
var start_date;
var con_destination;
var con_departure;
var con_end_date;
var con_start_date;

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
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
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let initiate = event.message.text
			
			if (status === 'st_new_user' && (initiate === 'hi' || initiate === 'hey' || initiate === 'Hi' && initiate === 'Hey')) 
        		{		
			sendTextMessage(sender, "Hey I am an Itinerary recommender, do you want to start creating your itinerary ?\n\n type start over to exit the process ")
			status = 'st_start';
			continue
			}
			
			if (initiate === 'hi' || initiate === 'hey' || initiate === 'Hi' && initiate === 'Hey') 
        		{		
			sendTextMessage(sender, "Hey I am an Itinerary recommender, do you want to start creating your itinerary ?\n\n type start over to exit the process ")
			status = 'st_start';
			continue
			}
			
			let start = event.message.text
			if (status === 'st_start' && (start === 'No' || start === 'no' || start === 'neh' || start ==='nop')) 
			{
			sendTextMessage(sender, "I am an itinerary recommender, simply say hi to get started")
	  		status = 'st_new_user';
			continue
			}
			
			if (start === 'st_start over' || start === 'Strat over' || start === 'Start Over' || start ==='exit' || start ==='quit') 
			{
			status = 'st_start';
	  		sendTextMessage(sender, "Hey I am an Itinerary recommender, do you want to start creating your itinerary ?")
			continue
			}
			
			if (status === 'st_start' && (start === 'yes' || start === 'Yes' || start === 'yeah' || start ==='sure')) 
               		{
			sendTextMessage(sender, "Give your Destination to strat creating your itinerary")
	  		status = 'st_destination';
			continue
			}

		// get user input to create the itinerary 

			let destination = event.message.text
			if (status === 'st_destination' && destination === 'test1')
			{
			status = 'st_departure';
			con_destination = destination;
			sendTextMessage(sender, "your destination is : " + destination + "\n\nwhat is your origin ?")
			continue 
			}
			
			if(status === 'st_departure' && destination !== 'test1') {
				let departure = event.message.text
				con_departure = departure;
			 	status = 'st_user_s_date';
			 	sendTextMessage(sender, "your departure location is : " + departure + "\n\nwhen are you planning to leave ?")
			 	continue
			}
		 	
		 	let start_date = event.message.text
			if (status === 'st_user_s_date' && start_date === 'test3') 
			{
			sendTextMessage(sender, "your departure date is : " + start_date + "\n\nwhen are you planning to return")
			con_start_date = start_date;
			 status = 'st_user_e_date' ;
			continue
			}

    			let end_date = event.message.text
   			if (status === 'st_user_e_date' && end_date === 'test4') 
      			{
			sendTextMessage(sender, "your return date is : " + end_date + "\n\n itinerary processing ..")
			con_end_date = end_date;
			sendTextMessage(sender, "your itinerary requirement  : \n\nDestination : "+con_destination+ "\nDeparture : " + con_departure+"\nStart date : "+con_start_date+"\nEnd date : "+con_end_date)
			continue
		
			}
		     	
		}

			if (event.postback) 
			{
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
		
		
	}


	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAAN1nQ8Jz3MBABpQib4sZB1UnMCIobDAQ7ArZA8w9U67AD1gimvvDCkLptz7k3keOTjZBY3DKZCyPIFZApIg3zn6I5ByFbNpQkwRfD99ZAejGmElK075ygLKJvHw4XWcb1ZCyY9V5gOkxgywVVhjZCWRCPPvBXdM5G1WykZCgcxSoPQZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
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

// get user confirmation to continue



function sendGenericMessage(sender) {
	
let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "airline_itinerary",
        "intro_message": "Here\'s your flight itinerary.",
        "locale": "en_US",
        "pnr_number": "ABCDEF",
        "passenger_info": [
          {
            "name": "Farbound Smith Jr",
            "ticket_number": "0741234567890",
            "passenger_id": "p001"
          },
          {
            "name": "Nick Jones",
            "ticket_number": "0741234567891",
            "passenger_id": "p002"
          }
        ],
        "flight_info": [
          {
            "connection_id": "c001",
            "segment_id": "s001",
            "flight_number": "KL9123",
            "aircraft_type": "Boeing 737",
            "departure_airport": {
              "airport_code": "SFO",
              "city": "San Francisco",
              "terminal": "T4",
              "gate": "G8"
            },
            "arrival_airport": {
              "airport_code": "SLC",
              "city": "Salt Lake City",
              "terminal": "T4",
              "gate": "G8"
            },
            "flight_schedule": {
              "departure_time": "2016-01-02T19:45",
              "arrival_time": "2016-01-02T21:20"
            },
            "travel_class": "business"
          },
          {
            "connection_id": "c002",
            "segment_id": "s002",
            "flight_number": "KL321",
            "aircraft_type": "Boeing 747-200",
            "travel_class": "business",
            "departure_airport": {
              "airport_code": "SLC",
              "city": "Salt Lake City",
              "terminal": "T1",
              "gate": "G33"
            },
            "arrival_airport": {
              "airport_code": "AMS",
              "city": "Amsterdam",
              "terminal": "T1",
              "gate": "G33"
            },
            "flight_schedule": {
              "departure_time": "2016-01-02T22:45",
              "arrival_time": "2016-01-03T17:20"
            }
          }
        ],
        "passenger_segment_info": [
          {
            "segment_id": "s001",
            "passenger_id": "p001",
            "seat": "12A",
            "seat_type": "Business"
          },
          {
            "segment_id": "s001",
            "passenger_id": "p002",
            "seat": "12B",
            "seat_type": "Business"
          },
          {
            "segment_id": "s002",
            "passenger_id": "p001",
            "seat": "73A",
            "seat_type": "World Business",
            "product_info": [
              {
                "title": "Lounge",
                "value": "Complimentary lounge access"
              },
              {
                "title": "Baggage",
                "value": "1 extra bag 50lbs"
              }
            ]
          },
          {
            "segment_id": "s002",
            "passenger_id": "p002",
            "seat": "73B",
            "seat_type": "World Business",
            "product_info": [
              {
                "title": "Lounge",
                "value": "Complimentary lounge access"
              },
              {
                "title": "Baggage",
                "value": "1 extra bag 50lbs"
              }
            ]
          }
        ],
        "price_info": [
          {
            "title": "Fuel surcharge",
            "amount": "1597",
            "currency": "USD"
          }
        ],
        "base_price": "12206",
        "tax": "200",
        "total_price": "14003",
        "currency": "USD"
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



// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
