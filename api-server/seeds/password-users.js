/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {username: 'user1', password_hash: '$2b$10$qVBUrIWUrgwttX/zmYH6f.W3xKNn.qTe8VSGd5pPp7Z2.7plMLW.G', email:'user1@email.com'}, //password
    {username: 'user2', password_hash: '$2b$10$6gsbao8SSwaCvVHWcdTHOeRJJsIappqt0JGCLY5Kj7emMT1m46Smi', email:'user2@email.com'}, //12345678
    {username: 'user3', password_hash: '$2b$10$vX2FPRqiurAEw5ESDfaPHeZ5TScDJ0By7vDyxWd1i0efOQk.YASvK', email:'user3@email.com'} //hunter2
  ]);
};
