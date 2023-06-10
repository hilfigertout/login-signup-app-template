const express = require('express');
const server = express();
const knex = require('knex')(require('./knexfile.js')[process.env.PORT || 'development']);
server.use(express.json());

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
  next();
});


server.get('/users', (req, res) => {
  knex('users')
  .then((data) => {
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send(`Unable to get user data: ${err}`);
  })
})


//DO NOT call server.listen() in this file. See index.js

module.exports = server;