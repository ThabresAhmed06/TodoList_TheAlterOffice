const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); 
app.use(bodyParser.json());

let users = []; 
let userLists = {}; 

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) return res.status(400).json({ error: "User exists" });
  
  users.push({ username, password });
  userLists[username] = [{ id: 'default', name: 'Personal', tasks: [] }];
  res.status(201).json({ message: "User created" });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ username: user.username });
});

app.get('/api/lists/:username', (req, res) => {
  res.json(userLists[req.params.username] || []);
});

app.post('/api/lists/:username', (req, res) => {
  userLists[req.params.username] = req.body.lists;
  res.json({ message: "Lists updated" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
