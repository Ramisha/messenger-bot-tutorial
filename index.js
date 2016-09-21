const MessengerApp = require('fb-messenger-app')
var messenger = new MessengerApp(EAAN1nQ8Jz3MBABpQib4sZB1UnMCIobDAQ7ArZA8w9U67AD1gimvvDCkLptz7k3keOTjZBY3DKZCyPIFZApIg3zn6I5ByFbNpQkwRfD99ZAejGmElK075ygLKJvHw4XWcb1ZCyY9V5gOkxgywVVhjZCWRCPPvBXdM5G1WykZCgcxSoPQZDZD)

app.post('/webhook', function (req, res) {
  
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
  var data = req.body
  messenger._handleCallback(res, data)
})

messenger.sendApiMessage(USER_ID, {text: 'Howdy!'})
 
var myImage = {
  attachment:
    { 
      type: 'image',
      payload: { 
        url: 'https://petersapparel.com/img/shirt.png'
      }
    }
  }
 
messenger.sendApiMessage(USER_ID, myImage)
