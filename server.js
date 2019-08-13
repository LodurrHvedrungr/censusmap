var path = require('path');
var express = require('express');

var app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.set('port', process.env.PORT || 8080);

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.listen(app.get('port'), function() {
  console.log('listening');
});
