/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const { CreateUser } = require('./cognitoActions');
const { verifyPaymentSession } = require('./verifyPaymentSessionAction');

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.post('/createUser', async (req, res, next) => {
  console.log('BODY:::', JSON.stringify(req.body));

  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;
  const sessionId = req.body.sessionId;

  if (!username || !email || !phone || !sessionId) {
    const err = new Error('username, email, phone and sessionId are required');
    err.statusCode = 400;
    return next(err);
  }

  const isValidPayment = await verifyPaymentSession(sessionId, email);

  if (!isValidPayment) {
    const err = new Error('Invalid Payment');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await CreateUser(username, email, phone);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post('/item', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body });
});

app.listen(3000, function () {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
