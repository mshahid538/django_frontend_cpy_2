const express = require('express');
const cors=require('cors')
const app = express();
const path = require('path');
const router = express.Router();
const axios = require('axios');
const { reset } = require('nodemon');

require('dotenv').config();
app.use(cors({ origin: "http://127.0.0.1:8000/accounts/google/login/callback/" }))


// backend_ip = "https://api.astoryai.com";
backend_ip = "localhost:8000";
// if (typeof process.env.LOCAL_IP != "undefined") {
//   backend_ip = process.env.LOCAL_IP
// }

APP_SECRET=process.env.APP_SECRET;

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
global_usernmae = 'fakename'
app.listen(process.env.port || 3000);
app.use(express.static(__dirname + '/'));
app.use(express.urlencoded({ extended: true }))

console.log('Running at Port 3000');

//add the router
app.use('/', router);