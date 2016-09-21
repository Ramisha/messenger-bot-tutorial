const MessengerApp = require('fb-messenger')

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
//var USER_ID = '1097914633661589';
app.use(bodyParser.json())

app.get('/', function (req, res) {
	res.send('testing ......' + myImage)
})

app.use(bodyParser.urlencoded({ extended: false }))

app.set('port', (process.env.PORT || 5000))

var messenger = new MessengerApp("EAAN1nQ8Jz3MBABpQib4sZB1UnMCIobDAQ7ArZA8w9U67AD1gimvvDCkLptz7k3keOTjZBY3DKZCyPIFZApIg3zn6I5ByFbNpQkwRfD99ZAejGmElK075ygLKJvHw4XWcb1ZCyY9V5gOkxgywVVhjZCWRCPPvBXdM5G1WykZCgcxSoPQZDZD")

app.post('/webhook', function (req, res) {

	res.send('Error, wrong token')
  var data = req.body
  messenger._handleCallback(res, data)


		let messaging_events = req.body.entry[0].messaging;
		let event = req.body.entry[0].messaging[0]
		let sender = event.sender.id

//messenger.sendApiMessage(USER_ID, {text: 'Howdy!'})
 
var myImage = {
  attachment:
    { 
      type: 'image',
      payload: { 
        url: 'http://www.asianexotica.org/img/location/kandy.jpg'
      }
    }
  }
 
 	
 if (event.message && event.message.text) {
		let initiate_temp = event.message.text
		var initiate = initiate_temp.toUpperCase();
		
 if(initiate !=== 'ABC'){
 	sendTextMessage(sender, "Hey I am an Itinerary recommender, do you want to start creating your itinerary ?" )
 }
 	
 	
 	
 }
 
 
})// end of webhook


//messenger.sendApiMessage(USER_ID, myImage)

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




app.listen(app.get('port'), function () {
	console.log('running on port', app.get('port'))
})
