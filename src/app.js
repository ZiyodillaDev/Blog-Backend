const http = require("http");
const bodyParser = require("./utils/parser");
const Io = require("./utils/io");
const Users = new Io("./src/db/users.json");
const User = require("./models/User");
const Blogs = new Io("./src/db/blogs.json");
const Blog = require("./models/Blog");
const request = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.url === "/auth/login" && req.method === "POST") {
    req.body = await bodyParser(req);
    const { username, password } = req.body;
    const users = await Users.read();
    const findUser = users.find(
      (user) => user.username === username && user.password === password
    );
    if (!findUser) {
      res.writeHead(403);
      return res.end(JSON.stringify({ message: "User not found" }));
    }
    res.writeHead(200);
    res.end(JSON.stringify({ token: findUser.id }));
  } else if (req.url === "/auth/register" && req.method === "POST") {
    req.body = await bodyParser(req);
    const { username, password } = req.body;
    const users = await Users.read();
    const findUser = users.find((user) => user.username === username);
    if (findUser) {
      res.writeHead(403);
      return res.end(JSON.stringify({ message: "User already exists" }));
    }
    const id = (users[users.length - 1]?.id || 0) + 1;
    const newUser = new User(id, username, password);
    const data = users.length ? [...users, newUser] : [newUser];
    Users.write(data);
    res.writeHead(201);
    res.end(JSON.stringify({ success: true }));
  } else if (req.url === "/blog" && req.method === "POST") {
    req.body = await bodyParser(req);
    const { text,description } = req.body;
    const user_id = req.rawHeaders[3].split(" ")[1];

    const blogs = await Blogs.read();
    const id = (blogs[blogs.length - 1]?.id || 0) + 1;
    const date = new Date();
    const newBlog = new Blog(id, date, text, user_id,description);

    const data = blogs.length ? [...blogs, newBlog] : [newBlog];

    Blogs.write(data);
    res.writeHead(201);
    res.end(JSON.stringify({ success: true }));
  } else if (req.url === "/blog" && req.method === "GET") {
    const blogs = await Blogs.read();

    res.end(JSON.stringify(blogs));
  } else if (req.url === "/blog" && req.method === "DELETE") {
    // req.body = await bodyParser(req);
    // const { text,description } = req.body;
    // const user_id = req.rawHeaders[3].split(" ")[1];

    // const blogs = await Blogs.read();
    // const id = (blogs[blogs.length - 1]?.id || 0) + 1;
    // const date = new Date();
    // const newBlog = new Blog(id, date, text, user_id,description);

    // const data = blogs.length ? [...blogs, newBlog] : [newBlog];

    // Blogs.write(data);
    // res.writeHead(201);
    // res.end(JSON.stringify({ success: true }));
  }
};

http.createServer(request).listen(2107);
