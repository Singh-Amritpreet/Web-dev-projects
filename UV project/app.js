import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.get("/", (req,res) => {
    res.render("home.ejs", {content: "hello"})
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});