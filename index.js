const express = require('express');
const app = express();

//Config
require('dotenv').config();
require('./src/lib/db_connection');
require('./src/lib/passport');
app.set('PORT', process.env.PORT || 4000 );

//Config middlewares
app.use(require('./src/middlewares'));

//Config routes
app.use('/api', require('./src/routes/api'));

app.listen(app.get('PORT'), () => {
    console.log("Server initialized at port " + app.get('PORT'));
});