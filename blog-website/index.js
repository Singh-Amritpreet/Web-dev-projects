import express from "express";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const port = 3000
const filePath = join(__dirname, "data", "blogs.json");



app.use(express.static(join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
      return res.send("Error loading blogs");
    }

    const blogs = JSON.parse(data);

    res.render("index.ejs", { blogs: blogs });
  });
});

app.get("/edit-blog/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
      return res.send("Error: " + err);
    }

    const blogs = JSON.parse(data);
    const blog = blogs.find((b) => b.id == id);

    if (!blog) {
      return res.send("Blog not found");
    }

    res.render("edit-blog.ejs", { blog });

  });
});



app.get('/blog/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
      return res.send("Error: " + err);
    }

    const blogs = JSON.parse(data);
    const blog = blogs.find(b => b.id == id);

    if (!blog) {
      return res.send("Blog not found");
    }

    res.render("blog.ejs", { blog });
  });
});


app.get("/add-blog", (req, res) => {
  res.render("add-blog.ejs"); 
});



app.post("/add-blog", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.send("error");
    }

    let blogs = data ? JSON.parse(data) : [];

    let maxId = 0;

    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].id > maxId) {
        maxId = blogs[i].id;
      }
    }

    const newId = maxId + 1;

    let newBlog = {
      id: newId,
      title: req.body.title,
      content: req.body.content
    };

    blogs.push(newBlog);

    fs.writeFile(filePath, JSON.stringify(blogs, null, 2), (err) => {
      if (err) {
        console.log(err);
        return res.send("error saving");
      }
      res.redirect("/");
    });
  });
});


app.post("/delete-blog/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
      return res.send("error reading file");
    }

    let blogs = JSON.parse(data);

    blogs = blogs.filter(b => b.id != id);

    fs.writeFile(filePath, JSON.stringify(blogs, null, 2), (err) => {
      if (err) {
        console.log(err);
        return res.send("error saving");
      }

      res.redirect("/");
    });
  });
});


app.post("/edit-blog-data/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
      return res.send("error reading file");
    }

    let blogs = JSON.parse(data);

    const blog = blogs.find(b => b.id == id);

    if (!blog) {
      return res.send("Blog not found");
    }

    blog.title = req.body.title;
    blog.content = req.body.content;

    fs.writeFile(filePath, JSON.stringify(blogs, null, 2), (err) => {
      if (err) {
        console.log(err);
        return res.send("error saving");
      }

      res.redirect("/");
    });
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})