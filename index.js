require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
//const shortid = require('shortid');
const dns = require('dns');


data = {};
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:url', function(req, res) {
  const { url } = req.params;
  
  if(url in data){
    res.redirect(data[url]);
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.post('/api/shorturl', function(req, res) {
  console.log(req.body);
 
  let { url } = req.body;
  let newurl;
  if( url.endsWith('/') ){
    newurl = url.slice(0,url.length-1);
  }

  if( url.includes('http') ){
    newurl = url.split('/')[2];
  }

  console.log(url);
  dns.lookup(newurl,(error)=>{
    if(error){
      return res.json({ error: 'invalid url' });

    } else {
      obj = {"original_url":url,"short_url":Object.keys(data).length};
      data[Object.keys(data).length] = url;
      return res.json(obj);

    }
  });


});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
