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
var name = '';

const express    = require('express')
const bodyParser = require('body-parser')
const request    = require('request')
const app        = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// browser output
app.get('/', function (req, res) {
    res.send('hello world i am an itinerary recommender bot !!');
    console.log('initiated'); 
    
})


const token = "EAAN1nQ8Jz3MBABpQib4sZB1UnMCIobDAQ7ArZA8w9U67AD1gimvvDCkLptz7k3keOTjZBY3DKZCyPIFZApIg3zn6I5ByFbNpQkwRfD99ZAejGmElK075ygLKJvHw4XWcb1ZCyY9V5gOkxgywVVhjZCWRCPPvBXdM5G1WykZCgcxSoPQZDZD"

//   let url = "https://graph.facebook.com/v2.6/sender?fields=first_name,last_name,profile_pic&access_token=token";
// 	facebook.api(url, function(err, data){
// 	 if(err){
//         console.error(err);
//         res.sendStatus(502);
//         res.end();
//     }
//     else{
//         name = first_name
//     }
// });


// to post data
app.post('/webhook/', function (req, res) {

    let messaging_events = req.body.entry[0].messaging
    // for (let i = 0; i < messaging_events.length; i++) {
    let event  = req.body.entry[0].messaging[0]
    let sender = event.sender.id
    var print
   

  //  console.log("********************************\n\n\n");
 //   console.log(JSON.stringify(event));
 //  console.log("\n*******\n"+JSON.stringify(res));
 // console.log('\n************************************\n\n\n')

 if (event.message && event.message.text && !event.message.is_echo) {
        var uuid = guid();
        let initiate_temp = event.message.text
        var initiate      = initiate_temp.toUpperCase();
        
          //	initiate.toLowerCase()
            if (status === 'st_new_user' && (initiate === 'HI' || initiate === 'HEY')) {
                sendTextMessage(sender, "Hey I am an Itinerary recommender, do you want to start creating your itinerary ?")
               // sendUserInputs(title)
                status = 'st_start';
            }

            if (status !== 'st_new_user' && (initiate === 'HI' || initiate === 'HEY')) {
                sendTextMessage(sender, "type start over to continue creating your itinerary ") 
                status = 'st_start';
            }

            if (status === 'st_start' && (initiate === 'NO' || initiate === 'NOP' || initiate === 'NEH')) {
                sendTextMessage(sender, "I am an itinerary recommender, simply say hi to get started")
                status = 'st_new_user';
            }
            
            if (initiate === 'START OVER' || initiate === 'EXIT' || initiate === 'QUIT') {

                status = 'st_start';
                sendTextMessage(sender, "Do you want to start creating your itinerary ?")
		 }

            if (status === 'st_start' && (initiate === 'YES' || initiate === 'YEAH' || initiate === 'SURE' || initiate === 'OK')) {
                status   = 'st_destination';
                initiate = '';
                sendTextMessage(sender, "Give your Destination to strat creating your itinerary")
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
                sendTextMessage(sender, "your departure location is : " + con_departure + "\n\nwhen are you planning to leave(dd/mm/yyyy) ?")
            }

           // let start_date = event.message.text
            if (status === 'st_user_s_date' && initiate !== '') {
            	con_start_date = initiate;
                sendTextMessage(sender, "your departure date is : " + start_date + "\n\nwhen are you planning to return(dd/mm/yyyy)")
                initiate      = '';
                status         = 'st_user_e_date';
            }

           // let end_date = event.message.text
            if (status === 'st_user_e_date' && initiate !== '') {
            	con_end_date = initiate; 
                sendTextMessage(sender, "your itinerary requirement  : \n\nDestination : " + con_destination + "\nDeparture : " + con_departure + "\nStart date : " + con_start_date + "\nEnd date : " + con_end_date + "\n\n\n Here is your itinerary ...")
                sendItinerary(sender)
            }
        }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
        }
    res.sendStatus(200)
}) // end of webhook 


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN


// separate and read the parameters from the backend url  

/*app.get('/api/users', function(req, res) {
 var user_id = req.params('id'); // id should be the parameter name in 
  var token = req.params('token');
  var geo = req.params('geo');  

 //res.send(user_id + ' ' + token + ' ' + geo);
});

The parameters are naturally passed through the req /foldername/file (/api/users)
*/


function sendUserInputs(print) {
    
    request({
        url: 'http://jsonplaceholder.typicode.com/posts',
        
        qs: {access_token: token},
        method: 'GET',

        json: {
            title: {title: print},
           
        }
        
    }, function (error, response, body) {
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
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

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


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}



// spin spin sugar
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})
