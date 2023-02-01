const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT ||  3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://fuzailzaman:a01yliF3xvgJnVWr@practice.3jxg4to.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

// Create a MongoDB schema for the data
const schema = new mongoose.Schema({
  code: String,
  description: String,
  status: String,
  role: String
});

// Create a MongoDB model based on the schema
const Model = mongoose.model('Model', schema);

app.use(express.json());

// Handle GET requests
app.get('/get', async (req, res) => {
  const data = await Model.find();
  res.send(data);
});

// Handle POST requests
app.post('/post', async (req, res) => {
  const data = new Model({
    code: req.body.code,
    description: req.body.description,
    status: req.body.status,
    role: req.body.role
  });
  await data.save();
  res.send(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});