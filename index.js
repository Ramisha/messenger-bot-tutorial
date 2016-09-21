const MessengerApp = require('fb-messenger')

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
//var USER_ID = '1097914633661589';
app.use(bodyParser.json())

app.get('/', function (req, res) {
	res.send('testing ......')
})

app.use(bodyParser.urlencoded({ extended: false }))

app.set('port', (process.env.PORT || 5000))

var messenger = new MessengerApp("EAAN1nQ8Jz3MBABpQib4sZB1UnMCIobDAQ7ArZA8w9U67AD1gimvvDCkLptz7k3keOTjZBY3DKZCyPIFZApIg3zn6I5ByFbNpQkwRfD99ZAejGmElK075ygLKJvHw4XWcb1ZCyY9V5gOkxgywVVhjZCWRCPPvBXdM5G1WykZCgcxSoPQZDZD")

app.post('/webhook', function (req, res) {

	res.send('Error, wrong token')
  var data = req.body
  messenger._handleCallback(res, data)


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
})// end of webhook

messenger.sendTextMessage(1097914633661589 , 'Hello')
//messenger.sendApiMessage(USER_ID, myImage)




app.listen(app.get('port'), function () {
	console.log('running on port', app.get('port'))
})



export default FBMessenger
