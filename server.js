const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const fileUpload = require('express-fileupload');
var fs = require('fs');

const path = require('path');

const app = express();

//Express Middleware
app.use(express.json());

app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));

// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  const { filename, abspath } = req.body;
  file.mv(`${__dirname}/client/public${abspath}${filename}`, err => {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({ fileName: filename, filePath: `${abspath}${filename}` });
  });
});
// Remove Endpoint
app.post('/remove', (req, res) => {
  if (req.body === null) {
    return res.status(400).json({ msg: 'No file to remove' });
  }
  const { filepath } = req.body;

  fs.unlinkSync(`${__dirname}/client/public/${filepath}`);

});

// DB Config   
//  const db = require('./config/default').mongoURI;
const db = config.get('mongoURI');

// setting MongoDB
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Connect to Mongo
mongoose
  .connect(db)
  .then(() => console.log('mongoDB Connected..'))
  .catch(err => console.log(err));


// Use Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/comments', require('./routes/api/comments'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/mangas', require('./routes/api/mangas'));
app.use('/api/chapters', require('./routes/api/chapters'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

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