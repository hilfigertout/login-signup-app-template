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
const tokenLength = 20;

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

server.get('/users/login/:token', (req, res) => {
  const token = req.params.token;
  knex('sessions as s')
    .join('users as u', 's.user_id', 'u.id')
    .where('s.token', token)
    .andWhere('s.expire_timestamp', '>=', Date.now())
    .then((data) => {
      console.log(data);
      if (data.length > 0) {
        res.status(200).send(data[0]);
      } else {
        throw new Error(`No active session for token ${token}`)
      }
    })
    .catch(err => {
      console.log(err);
      res.status(401).send({message: err});
    });

})

server.post('/users/login', (req, res) => {
  //TODO - validate user login credentials
  const {username} = req.body;
  knex('users')
    .where('username', username)
    .then((users) => {
      if (users.length === 1) {
        let expireTimestamp = Date.now() + 86400000
        let sessionId = generateId(tokenLength);
        knex('sessions')
          .insert({token: sessionId, user_id: users[0].id, expire_timestamp: expireTimestamp})
          .then((response) => {
            res.status(200).send({message: "Login successful", token: sessionId, expiration: expireTimestamp});
          })
          .catch((err) => console.error(`Insert error: ${err}`));
      } else { 
        res.status(401).send({message: "No such user exists."})
      }
    }).catch(err => {
      console.log(err);
      res.status(500).send({message: "Unable to query user table."})  
    }); 
})


//DO NOT call server.listen() in this file. See index.js

module.exports = server;