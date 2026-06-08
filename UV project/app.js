import express, { response } from "express";
import axios from "axios";

const app = express();
const port = 3000;
let lat, lng, forecast;

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.post("/location", (req, res) => {
  lat = req.body.lat;
  lng = req.body.lng;
  forecast = "my forecast"
  res.json({ success: true, content: {
    lat: lat,
    lng: lng,
    forecast: forecast
  }});
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});