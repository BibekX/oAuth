const passport = require("passport");
const knexFile = require("./knexfile").development;
const knex = require("knex")(knexFile);

module.exports = (app, bcrypt) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    let users = await knex("users").where({ id: id });

    if (users.length === 0) {
      return done(new Error(`Wrong user id: ${id}`));
    }
    let user = users[0];
    return done(null, user);
  });

  require("./strategies/local-strategy")(passport, bcrypt, knex);
  require("./strategies/facebook-strategy")(passport, knex);
  require("./strategies/google-strategy")(passport, knex);
};
