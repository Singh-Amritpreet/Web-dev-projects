import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "iampassword",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted(currentUserId) {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = ($1)", [currentUserId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getUsersData() {
  const result = await db.query("SELECT * FROM users;");
  let users = result.rows;
  return users;
}

async function getCurrentUserData(currentUserId) {
  const result = await db.query("SELECT * FROM users WHERE id = ($1)", [currentUserId]);
  let userData = result.rows;
  return userData[0];
}

app.get("/", async (req, res) => {
  const countries = await checkVisisted(currentUserId);
  const currentUserData = await getCurrentUserData(currentUserId);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: await getUsersData(),
    color: currentUserData.color,
  });
});

app.post("/add", async (req, res) => {
  const newCountry = req.body.country;

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [newCountry.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;

    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      ); 
      res.redirect("/");
    } catch (error) {
      const countries = await checkVisisted(currentUserId);
      const currentUserData = await getCurrentUserData(currentUserId);
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: await getUsersData(),
        color: currentUserData.color,
      });
    }


  } catch (error) {
  const countries = await checkVisisted(currentUserId);
  const currentUserData = await getCurrentUserData(currentUserId);

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: await getUsersData(),
    color: currentUserData.color,
    error: "Country name does not exist, try again."
  });
  }
});

app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs");
  } else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html

  const name = req.body.name;
  const color = req.body.color;
  const result = await db.query(
    "INSERT INTO users (name,color) VALUES ($1,$2) RETURNING *",
    [name, color]
  );

  currentUserId = result.rows[0].id;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
