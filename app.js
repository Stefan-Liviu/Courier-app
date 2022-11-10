const express = require("express");
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const path = require('path');
const bodyParser = require("body-parser");
const flash = require('connect-flash')
const indexRouter = require('./routers/index');
const usersRouter = require('./routers/users');
const adminRouter = require('./routers/admin');
const parcelRouter = require('./routers/parcel');

const app = express();


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



app.use(express.static(__dirname + '/public'));
app.set('views',  [path.join(__dirname, 'views'), 
                   path.join(__dirname, 'views/admin'),
                   path.join(__dirname, 'views/user')]);
app.set('view engine', 'ejs');

app.use(flash());

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', adminRouter);
app.use('/', parcelRouter);


app.listen(process.env.PORT || 3000);
