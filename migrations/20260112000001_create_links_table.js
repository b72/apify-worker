/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('links', function(table) {
    table.increments('id').unsigned().primary();
    table.text('url').notNullable();
    table.string('hash', 255).notNullable().unique();
    table.bigInteger('parent_id').nullable();
    table.integer('status').nullable();
    table.enum('type', ['page', 'profile', 'post', 'root']).nullable();
    table.json('crawl_config').nullable;
    table.dateTime('last_crawled_at').nullable();
    table.integer('response_time').nullable();
    table.integer('frequency_insec').notNullable().defaultTo(3600);
    table.integer('priority').notNullable().defaultTo(0);
    table.integer('no_of_visits').notNullable().defaultTo(0);
    table.json('meta_data').nullable();
    table.integer('user_id').notNullable();
    table.timestamps(true, true); // adds created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('links');
};
