import express from "express";
const app = express()
const port = 3000
import fs from "fs";



app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("index.ejs");
})



app.get('/blog/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile("data/blogs.json", (err, data) => {
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
  fs.readFile("data/blogs.json", "utf-8", (err, data) => {
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

    fs.writeFile("data/blogs.json", JSON.stringify(blogs, null, 2), (err) => {
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