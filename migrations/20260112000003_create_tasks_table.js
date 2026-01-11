/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table) {
    table.string('id', 255).primary();
    table.string('type', 255).nullable();
    table.string('act_id', 255).nullable();
    table.dateTime('started_at').nullable();
    table.dateTime('finished_at').nullable();
    table.string('status', 255).nullable();
    table.json('meta_data').nullable();
    table.timestamps(true, true); // adds created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tasks');
};
