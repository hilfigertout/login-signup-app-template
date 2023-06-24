const bcrypt = require("bcrypt");

const getUsers = async () => {

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash("password", salt, (err, hash) => {
      console.log(hash);
    })
  })
  
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash("password", salt, (err, hash) => {
      console.log(hash);
    })
  })
  
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash("password", salt, (err, hash) => {
      console.log(hash);
    })
  })
  }

getUsers();