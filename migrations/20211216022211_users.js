exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments().unique();
    table.string("email");
    table.string("password");
    table.string("facebook_id");
    table.string("gmail_id");
    table.string("access_token", 500);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
