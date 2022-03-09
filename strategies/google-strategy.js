const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

require("dotenv").config();

module.exports = (passport, knex) => {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "https://localhost:3000/auth/gmail/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const user = {
            username: profile.emails[0].value,
          };
          const userResult = await knex("users").where("gmail_id", profile.id);

          if (userResult.length === 0) {
            const query = await knex("users")
              .insert({
                email: profile.emails[0].value,
                gmail_id: profile.id,
              })
              .returning("id");
            user.id = query[0];
            return done(null, user);
          } else {
            user.id = userResult[0].id;
            return done(null, user);
          }
        } catch (err) {
          return done(err, false, { message: "Couldn't add user" });
        }
      }
    )
  );
};
