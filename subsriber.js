


const express = require('express')
const bodyParser = require('body-parser');


const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.raw());

const port = 3000
const appDomain = process.argv[3] || "http://localhost:3000"
const resource = process.argv[2]

app.get('/', (req, res) => {  
  console.log('GET: Home');
  res.send('Hello World!')
})


app.get('/events', (req, res) => {
	//TODO: verify the mode and topic
  if (req.query['hub.mode'] && req.query['hub.topic'] && req.query['hub.challenge'] && req.query['hub.lease_seconds']) {
    console.log('Callback successful: Replying with challenge:', req.query['hub.challenge']);
    res.send(req.query['hub.challenge']);
  } else {
    console.log('Callback: Missing required information. Return 404\nReceived query params:', req.query);
  	res.sendStatus(404)
  }
})

app.post('/events', (req, res) => {
  console.log('POST: Got body:', req.body);
  res.sendStatus(200);
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  discover(resource, subscribe)
})

var request = require("request");
var parseLinkHeader = require('parse-link-header');




function discover(resource, callback) {
    console.log("Discover Hub and Topic for: ", resource)
	var options = {
		method: 'HEAD',
		url: resource
	};

	request(options, function (error, response, body) {
    	if (error) throw new Error(error);
    	var parsed = parseLinkHeader(response.headers.link);
    	callback({
    		hub: parsed.hub.url,
    		topic: parsed.self.url
    	});
    });
}

function subscribe(info) {
  console.log("Subscribing to Hub %s - Topic %s ", info.hub, info.topic)
  var options = {
    method: 'POST',
    url: info.hub,
    headers:
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
   form:
    {
      'hub.mode': 'subscribe',
      'hub.topic': info.topic,
      'hub.callback': appDomain + '/events'
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log("Request: Subscribed response status:", response.statusCode);
  });
}
