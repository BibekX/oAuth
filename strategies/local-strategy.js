const LocalStrategy = require("passport-local").Strategy;

module.exports = (passport, bcrypt, knex) => {
  passport.use(
    "local-signup",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          let users = await knex("users").where({ email });
          if (users.length > 0) {
            return done(null, false, { message: "Email already taken" });
          }
          let hash = await bcrypt.hashPassword(password);

          let newUser = { email, password: hash };
          let userId = await knex("users").insert(newUser).returning("id");
          newUser.id = userId[0];
          done(null, newUser);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          let users = await knex("users").where("email", email);
          if (users.length === 0) {
            return done(null, false, { message: "No user with this email" });
          }
          let user = users[0];
          console.log("USER", user);
          let result = await bcrypt.checkPassword(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
