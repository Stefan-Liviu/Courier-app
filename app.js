const express = require("express");
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const bodyParser = require("body-parser");
const flash = require('connect-flash')
const indexRouter = require('./routers/index');
const usersRouter = require('./routers/users');

const app = express();
const port = 3000;

app.use(cookieParser());

app.use(sessions( {
    secret:'thisismysecretkey',
    saveUninitialized:true,
    cookie:{maxAge: 8640000},
    resave: false
}));

app.use(function(req, res, next) {
    res.locals.sessions = req.session;
    next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(flash());

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.use('/', indexRouter);
app.use('/', usersRouter);


app.listen(port, () => {
    console.log('App listening on port', port);
})