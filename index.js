const express = require('express');
const app = express();
const http = require('http');

//Config
require('dotenv').config();
require('./src/lib/db_connection');
require('./src/lib/passport');
app.set('PORT', process.env.PORT || 4000 );

//Config middlewares
app.use(require('./src/middlewares'));

//Config routes
app.use('/api', require('./src/routes/api'));

const server = http.createServer(app);
const initWebSockets = require('./src/socket-connection');
initWebSockets(server);

server.listen(app.get('PORT'), () => {
    console.log("Server initialized at port " + app.get('PORT'));
});