const express = require("express");
const morgan = require("morgan");
const frm = require("fcm-node");
const mailer = require("nodemailer");

const siteRouters = require("./routes/siteRoutes");
const emailRouters = require("./routes/emailRoutes");
const dbCN = require("./lib/dbConn.js");
// Create app
const app = express();

dbCN.then(() => {
  app.listen(3000);
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3rd party middleware
app.use(morgan("dev"));

// // local middleware
// app.use((req, res, next) => {
//     console.log("Middleware checking");
//     console.log("method: ", req.method);
//     console.log("path: ",req.path);
//     console.log("host: ",req.hostname);
//     next();
// });

// app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//     res.sendFile('./views/index.html', {root: __dirname});
//     // res.render("index", {title: 'Home'});
// });

// app.get('/about', (req, res) => {
//     res.sendFile('./views/about.html', {root: __dirname});
// });

// app.get('/about-us', (req, res)=>{
//     res.redirect('/about');
// });

app.get("/", (req, res) => {
  res.redirect("/sites/list");
});

app.use("/sites", siteRouters);
app.use("/emails", emailRouters);

// 404 page
app.use((req, res) => {
  res.status(404).json({ error: "Request Not Found" });
  // res.status(404).sendFile('./views/404.html', {root: __dirname});
});
