const MessengerApp = require('fb-messenger')

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.use(bodyParser.json())

app.get('/', function (req, res) {
	res.send('testing ......'+ sender)
})

app.use(bodyParser.urlencoded({ extended: false }))

app.set('port', (process.env.PORT || 5000))

var messenger = new MessengerApp('EAAN1nQ8Jz3MBABpQib4sZB1UnMCIobDAQ7ArZA8w9U67AD1gimvvDCkLptz7k3keOTjZBY3DKZCyPIFZApIg3zn6I5ByFbNpQkwRfD99ZAejGmElK075ygLKJvHw4XWcb1ZCyY9V5gOkxgywVVhjZCWRCPPvBXdM5G1WykZCgcxSoPQZDZD')



////////////////////////////// start :: webhook //////////////////////////////////


app.post('/webhook', function (req, res) {
	

res.send('Error, wrong token')
var data = req.body
var messaging_events = req.body.entry[0].messaging;
var event = req.body.entry[0].messaging[0]
var sender = event.sender.id



if (event)
{
	messenger.sendTextMessage(sender, 'Hello')
	
}
 
var myImage = {
  attachment:
    { 
      type: 'image',
      payload: { 
        url: 'http://www.asianexotica.org/img/location/kandy.jpg'
      }
    }
  }
 // res.sendStatus(200);
})

////////////////////////////// end :: webhook //////////////////////////////////
//messenger.sendApiMessage(USER_ID, myImage)




app.listen(app.get('port'), function () {
	console.log('running on port', app.get('port'))
})

