const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();

//Express Middleware
// app.use(express.json());

//Bodyparser Middleware
app.use(bodyParser.json());

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

  const port = process.env.PORT || 5000;
  
  app.listen(port, () => console.log(`Server started on port ${port}`));