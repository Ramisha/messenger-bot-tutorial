'use strict'

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
    res.send('NEGO_BOT started !!');
    console.log('initiated');
    //res.send('lol lol');
})
// to post data
app.post('/webhook/', function (req, res) {

   
	 var results = req.body;
	var bid = req.body.parameters.unit-currency.amount;
    console.log(req);
    // console.log(req);
	
	
	//var bid = JSON.stringify(results.toString());
	//res.end(req.params.set-bid);  console.log(req.body.title);

    var speech = "this is a webhook response for the bid  : " + bid;
    var ret = {
        "speech": speech,
        "displayText": speech,
        "source": "web hook from heroku"
    };

    res.setHeader('content-type', 'application/json');

    res.send(ret);
	
	
	
    res.sendStatus(200)
})

app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})
