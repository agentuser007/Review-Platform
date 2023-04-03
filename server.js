const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, './')));

// Serve the index.html file
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Start the server
app.listen(8080, function() {
  console.log('Server started on port 8080');
});

