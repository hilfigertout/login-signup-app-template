const express = require('express');
const server = express();
const knex = require('knex')(require('./knexfile.js')[process.env.PORT || 'development']);
server.use(express.json());
const bcrypt = require('bcrypt');

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
  next();
});

const generateToken = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result = result + characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result;
}

const tokenLength = 20;
const saltRounds = 10;



server.get('/users', (req, res) => {
  knex('users')
  .then((data) => {
    res.status(200).send(data);
  })
  .catch(err => {
    console.log(err);
    return res.status(500).send(`Unable to get user data: ${err}`);
  })
})

server.post('/users', (req, res) => {
  let {username, email, password} = req.body;
  if (username && email && password) {
    return bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(`Error hashing password ${err}`);
        return res.status(500).send({message: "Error: unable to create user"})
      }
      knex('users')
      .insert({username: username, email: email, password_hash: hash})
      .returning('id')
      .then((idArray) => res.status(201).send({user_id: idArray[0].id, message: `User created with id ${idArray[0].id}`}))
      .catch(err => {
        console.log(`Unable to create user: ${err}`);
        return res.status(500).send({message: "Error: unable to create user"});
      })
    })
  } else {
    return res.status(400).send({message: "Bad request, cannot create user."})
  }
})

server.get('/users/login/:token', (req, res) => {
  const token = req.params.token;
  knex('sessions as s')
    .join('users as u', 's.user_id', 'u.id')
    .where('s.token', token)
    .andWhere('s.expire_timestamp', '>=', Date.now())
    .then((data) => {
      if (data.length > 0) {
        return res.status(200).send(data[0]);
      } else {
        return res.status(401).send(`No active session for token ${token}.`)
      }
    })
    .catch(err => {
      console.log(`Unable to search for session token: ${err}`);
      return res.status(500).send({message: "Unable to pull user sesssions."});
    });

})

server.post('/users/login', (req, res) => {
  const {username, password} = req.body;
  knex('users')
    .where('username', username)
    .then((users) => {
      if (users.length === 1) {
        bcrypt.compare(password, users[0].password_hash, (err, result) => {
          if (result) {
            let expireTimestamp = Date.now() + 86400000
            let sessionToken = generateToken(tokenLength);
            knex('sessions')
              .insert({token: sessionToken, user_id: users[0].id, expire_timestamp: expireTimestamp})
              .then((response) => {
                return res.status(200).send({message: "Login successful", token: sessionToken, user_id: users[0].id, expire_timestamp: expireTimestamp});
              })
              .catch((err) => {
                console.log(`Could not create user session: ${err}`); 
                return res.status(500).send({message: "Error creating session"}
              )});
          } else {
            return res.status(401).send({message: "Incorrect password"})
          }
        })
      } else { 
        return res.status(404).send({message: "No such user exists."})
      }
    }).catch(err => {
      console.log(`Could not query user table: ${err}`);
      return res.status(500).send({message: "Unable to locate users."})  
    }); 
})

server.delete('/users/login', (req, res) => {
  if (req.body) {
    const {token, user_id, expire_timestamp} = req.body;
    knex('sessions')
      .where('token', token)
      .andWhere('user_id', user_id)
      .del()
      .then(() => {
        return res.status(200).send({message: 'Session closed'})
      })
      .catch(err => {
        console.log(`Unable to delete user session from record: ${err}`);
        return res.status(500).send({message: 'Unable to delete session token from record'})
      })
  }
})


//DO NOT call server.listen() in this file. See index.js

module.exports = server;