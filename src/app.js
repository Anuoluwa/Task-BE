const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const { Op } = require('sequelize');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)



app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Deel Tasks By Anu Apiti'
    });
  });

  app.use('/api/v1', router);


  app.use('*', (req, res) =>
  res.status(404).json({
    status: 404,
    message: 'No endpoint matches that URL'
  })
);


module.exports = app;
