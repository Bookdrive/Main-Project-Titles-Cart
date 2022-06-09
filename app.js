const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session');
const { redirect } = require("express/lib/response");

const titleRoutes = require("./Routes/route");
require('./passport-setup');

const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));


// pool.getConnection((err, connection) => {
//     if (err) throw err;

//     console.log("connected")
// });



app.use(cookieSession({
    name: 'notes-sharing-system',
    keys: ['key1', 'key2']
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(titleRoutes);

app.listen(3000, function () {
    console.log("server is running at port 3000");
});