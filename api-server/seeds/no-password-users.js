/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {username: 'user1', password_hash: 'hash1', password_salt: 'salt1', email:'user1@email.com'},
    {username: 'user2', password_hash: 'hash2', password_salt: 'salt2', email:'user2@email.com'},
    {username: 'user3', password_hash: 'hash3', password_salt: 'salt3', email:'user3@email.com'}
  ]);
};
