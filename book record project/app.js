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

async function getAlldata() {
    const response = await db.query("SELECT * FROM books");;
    const data = response.rows;
    return data;
}

app.get("/", async (req, res) => {
    const data = await getAlldata();
    res.render("index.ejs", {data: data});
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});

app.get("/books/:isbn", async (req, res) => {
    const isbn = req.params.isbn;

    const result = await db.query(
        "SELECT * FROM books WHERE isbn = $1",
        [isbn]
    );

    if (result.rows.length === 0) {
        return res.status(404).send("Book not found");
    }

    res.render("book.ejs", {
        data: result.rows[0]
    });
});

app.get("/edit/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;

        const result = await db.query(
            "SELECT * FROM books WHERE isbn = $1",
            [isbn]
        );

        const book = result.rows[0];

        res.render("edit.ejs", {
            book: book
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading book");
    }
});

app.post("/add", async (req, res) => {
    try {
        const {
            isbn,
            title,
            author,
            date_read,
            rating,
            review
        } = req.body;

        await db.query(
            `INSERT INTO books
            (isbn, title, author, date_read, rating, review)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [isbn, title, author, date_read, rating, review]
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding book");
    }
});

app.post("/edit/:isbn", async (req, res) => {
    try {
        const originalIsbn = req.params.isbn;

        const {
            isbn,
            title,
            author,
            date_read,
            rating,
            review
        } = req.body;

        await db.query(
            `UPDATE books
             SET isbn = $1,
                 title = $2,
                 author = $3,
                 date_read = $4,
                 rating = $5,
                 review = $6
             WHERE isbn = $7`,
            [
                isbn,
                title,
                author,
                date_read,
                rating,
                review,
                originalIsbn
            ]
        );

        res.redirect(`/books/${isbn}`);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating book");
    }
});

app.post("/delete/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;

        await db.query(
            "DELETE FROM books WHERE isbn = $1",
            [isbn]
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting book");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});