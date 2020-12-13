

const request = require("request");
const express = require('express')
const bodyParser = require('body-parser');


const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.raw());

const port = 3020
const appDomain = process.argv[2] || "http://localhost:3020"

app.get('/', (req, res) => {  
  console.log('GET: Home')
  res.send('Hub: Hello World!')
})


app.post('/blog/Rth6WbeIXI6WRmKPoAaW/hub', (req, res) => {
  console.log('POST: Process subscription request:', req.body)
  console.log('Verifing the subscriber callback URL:', req.body['hub.callback'])

	var options = {
		method: 'GET',
		url: req.body['hub.callback'],
		headers:
    	{
    	  'Content-Type': 'application/x-www-form-urlencoded'
    	},
   		qs:
    	{
    	  'hub.mode' : 'subscribe',
    	  'hub.topic' : req.body['hub.topic'],
    	  'hub.challenge': Math.random().toString(36),
    	  'hub.lease_seconds': '60'
   		}
	};

	request(options, function (error, response, body) {
    	if (error) throw new Error(error);
    	console.log("Response from the subscribers callback:", response.statusCode)
    	if (response.statusCode >= 200 && response.statusCode <= 299) {
    		console.log("Successfully subscribed to the [%s] topic.", req.body['hub.topic'])
    	} else {
    		console.log("Failed to subscribe to the [%s] topic.", req.body['hub.topic'])
    	}
    });
  res.sendStatus(202)
})


app.listen(port, () => {
  console.log(`Hub listening at http://localhost:${port}`)
})