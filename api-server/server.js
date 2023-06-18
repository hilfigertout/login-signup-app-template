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

const generateId = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result = result + characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result;
}
const cookieLength = 20;

server.get('/users', (req, res) => {
  knex('users')
  .then((data) => {
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send(`Unable to get user data: ${err}`);
  })
})

// server.post('/users', (req, res) => {
//   //TODO - create new user account
// })

server.post('/users/login', (req, res) => {
  //TODO - validate user login credentials
  
  knex('users')
    .where('username', req.query.username)
    .then((users) => {
      if (users.length === 1) {
        let today = new Date()
        let sessionId = generateId(cookieLength);
        res.cookie('session', sessionId);
        knex('session')
          .insert({token: sessionId, user_id: users[0].id, expire_date: new Date(today.getTime() + 86400000).toDateString()})
          .then((response) => {
            res.status(200).send({message: "Login successful"});
          })
          .catch((err) => console.error(`Insert error: ${err}`));
      } else { 
        res.status(401).send({message: "No such user exists."})
      }
    }).catch(err => {
      console.log(err);
      res.status(500).send({message: "Unable to query user table."})  
    });
  //TODO - send back a cookie, store cookie in database.
  

})


//DO NOT call server.listen() in this file. See index.js

module.exports = server;