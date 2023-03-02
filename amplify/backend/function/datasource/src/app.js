const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');
var mysql = require('mysql');

let connection;

const connectionString = async () => {
  const ssm = new AWS.SSM({ region: process.env.REGION });
  const parameter = await ssm
    .getParameter({
      Name: process.env.RDS_PASSWORD,
      WithDecryption: true,
    })
    .promise();
  return parameter.Parameter.Value;
};

(async () => {
  const cs = await connectionString();
  connection = mysql.createConnection(JSON.parse(cs));

  connection.connect(function (err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    app.listen(3000, function () {
      console.log('Server started');
    });
  });
})();

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

app.get('/items', function (req, res) {
  connection.query('SELECT * FROM activity', function (err, result, fields) {
    if (err) {
      res.status(400).json({ error: 'Query failed!' });
      throw err;
    }
    res.json(result);
  });
});

module.exports = app;
