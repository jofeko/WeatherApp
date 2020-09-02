require('dotenv').config();

const OWM_API_KEY = process.env.OWM_API_KEY;
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + OWM_API_KEY + "&units=" + unit;

  https.get(url, (response) => {
    console.log(response.statusCode);
    if (response.statusCode !== 200) {
      res.sendFile(__dirname + "/error.html");
    } else {
      response.on("data", (d) => {
        const weatherData = JSON.parse(d);
        const temp = Math.round(weatherData.main.temp);
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@4x.png"

        res.write("<body style='background-image: linear-gradient(to bottom, #311847, #3EB9E6);color:white; font-size: 2rem; font-family: monospace; text-align: center; position: absolute; top: 50%; left: 50%;transform: translateX(-50%) translateY(-50%);'></body>");
        res.write("<h1 style='margin: 0; font-size: 2.5em;'>" + query + "</h1>");
        res.write("<img src=" + imageURL + ">");
        res.write("<h2 style='margin: 0 0 1rem;'>" + temp + "&degC</h2>");
        res.write("<h3 style='margin: 0;'>" + weatherDescription + "</h3>");
        res.send();
      });
    };
  });
});

app.post("/error", (req, res) => {
  res.redirect("/");
});

const listener = app.listen(port, () => {
  console.log("Server is running at http://localhost:" + listener.address().port);
});
