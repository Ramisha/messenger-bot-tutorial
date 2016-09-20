'use strict'
var status = 'st_new_user';
var destination = '';
var departure = '';
var end_date = '';
var start_date = '';
var con_destination = '';
var con_departure = '';
var con_end_date = '';
var con_start_date = '';

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var Q = require("q");

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

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
	let messaging_events = req.body.entry[0].messaging;
		let event = req.body.entry[0].messaging[0]
		let sender = event.sender.id
		if (event.message && event.message.text) {
		let initiate_temp = event.message.text
		var initiate = initiate_temp.toUpperCase();
		switch(status) {
    case "st_new_user":
			 if(initiate === "HI"){
				 status = sendTextMessage(sender, "Hey I am an Itinerary recommender, do you want to start creating your itinerary ?\n\n type start over to exit the process ","st_start", "st_new_user" )
			 }
			 	res.sendStatus(200)        
        break;
    case "st_start":
 			if(initiate === "YES"){
			  status = sendTextMessage(sender, "Give your Destination to start creating your itinerary \n or select a random itinerary", 'st_destination','st_start')
			 }
			 	res.sendStatus(200) ;			        
        break;
    default:status ='st_new_user'
			res.sendStatus(200);
}
		}
		
})

function sendTextMessage(sender, text, onSuccess, onError) {
	let messageData = { text: text }

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: token },
		method: 'POST',
		json: {
			recipient: { id: sender },
			message: messageData,
		}
	}, function (error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
			return onError;
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
			return onError;
		}
		return onSuccess;
	})
}
