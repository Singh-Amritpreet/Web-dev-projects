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

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

async function getItems() {
  const response = await db.query("SELECT * FROM items");
  const items = response.rows;
  return items;
}

app.get("/", async (req, res) => {
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: await getItems(),
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const toUpdatedItemId = req.body.updatedItemId;
  const toUpdatedItemTitle = req.body.updatedItemTitle;

  await db.query(
    "UPDATE items SET title = $1 WHERE id = $2",
    [toUpdatedItemTitle, toUpdatedItemId]
  );

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const toDeleteItemId = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1", [toDeleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
