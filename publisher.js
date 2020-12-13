


const express = require('express')
const bodyParser = require('body-parser');


const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.raw());

const port = 3010
const appDomain = process.argv[2] || "http://localhost:3010"

app.get('/', (req, res) => {  
  console.log('GET: Home')
  res.send('Publisher: Hello World!')
})


app.get('/blog', (req, res) => {
  console.log('GET: Reply with Hub and topic')
  res.set('Link', ' <http://localhost:3020/blog/Rth6WbeIXI6WRmKPoAaW>; rel="self",  <http://localhost:3020/blog/Rth6WbeIXI6WRmKPoAaW/hub>; rel="hub"');
  res.sendStatus(200)
})


app.listen(port, () => {
  console.log(`Publisher app listening at http://localhost:${port}`)
})
