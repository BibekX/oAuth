const passport = require("passport");

module.exports = (express) => {
  const router = express.Router();

  function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  router.get("/secret", isLogged, (req, res) => {
    console.log("auth user", req.user.id);
    // console.log("SESSION INFO:", req.session.passport);
    res.sendFile(__dirname + "/public/secret.html");
  });

  router.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/public/signup.html");
  });

  router.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/login",
      failureRedirect: "/signup",
      failureFlash: true,
    })
  );

  router.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
  });

  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/secret",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  router.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email", "public_profile"] })
  );

  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/secret",
      failureRedirect: "/error",
    })
  );

  router.get(
    "/auth/gmail",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  router.get(
    "/auth/gmail/callback",
    passport.authenticate("google", {
      successRedirect: "/secret",
      failureRedirect: "/error",
    })
  );

  router.get("/error", (req, res) => {
    res.send("You are not logged in!");
  });

  router.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });

  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  });

  return router;
};
