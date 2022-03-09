const FacebookStrategy = require("passport-facebook").Strategy;

require("dotenv").config();

module.exports = (passport, knex) => {
  passport.use(
    "facebook",
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "https://localhost:3000/auth/facebook/callback",
        profileFields: ["id", "email", "name", "gender", "displayName"],
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("profile", profile);

        let userResult = await knex("users").where({ facebook_id: profile.id });
        if (userResult.length === 0) {
          let user = {
            facebook_id: profile.id,
            email: profile.displayName,
          };
          let query = await knex("users").insert(user).returning("id");
          user.id = query[0];
          done(null, user);
        } else {
          done(null, userResult[0]);
        }
      }
    )
  );
};
