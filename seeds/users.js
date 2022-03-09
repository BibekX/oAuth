exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { email: "a@a.com", password: "abc" },
        { email: "b@b.com", password: "123" },
        { email: "c@c.com", password: "321" },
      ]);
    });
};
