/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id');
    table.string('username').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('password_salt').notNullable();
    table.string('email').notNullable();
    table.timestamps(true, true);
  }).createTable('sessions', table => {
    table.increments('id');
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
    table.datetime('expire_date', {useTz: false, precision: 0});
    table.string('token').unique();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sessions')
    .dropTableIfExists('users');
};
