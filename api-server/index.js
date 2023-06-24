const server = require('./server.js');
const PORT = process.env.PORT || 8080;
const knex = require('knex')(require('./knexfile.js')[process.env.PORT || 'development']);


const clearOldTokens = () => {
  knex('sessions')
    .where('expire_timestamp', "<", Date.now())
    .del()
    .then(() => console.log("Expired tokens cleared"))
    .catch((err) => console.log(`Could not clear expired tokens: ${err}`));
}

clearOldTokens();
server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});