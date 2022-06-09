const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./Database/database');

// pool.getConnection((err, connection) => {
//   if (err) throw err;

//   console.log("connected for password")
// });

passport.serializeUser(function (user, done) {
  done(null, user)
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: "clientID",
  clientSecret: "clientSecret",
  callbackURL: "http://localhost:3000/google/callback"
},
  async (accessToken, refreshToken, profile, done) => {
    const query = "SELECT Googleid FROM users WHERE Googleid = ?";
    const rows = await db.query(query, [profile.id]);
    if (rows.length === 0) {
      const query2 = "INSERT INTO users (Googleid, Name,Email,profile) VALUES (?, ?, ?, ?)";
      await db.query(query2, [profile.id, profile.displayName, profile.emails[0].value, profile.photos[0].value]);
    }
    return done(null, profile);
  }
));