const connectionDb = require('./database');
const bcrypt = require('bcrypt');
const salt = 10;

//create tabel
function createTabel() {
    
    let sql = "CREATE TABLE IF NOT EXISTS members (id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, email VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL)"
    connectionDb.query(sql, (err) => {
        if (err) throw err;
    })
}

//register
function register(req, res) {

    let data = req.body;
    let hash = bcrypt.hashSync(data.password, salt);
    let time = new Date();

    let sql = "INSERT INTO members (id, username, password, email, created_at) VALUES ?";
    let value = [
        [0, data.username, hash, data.email, time]
    ]  

    connectionDb.query(sql, [value], (err) => {
        if (err) {
            req.flash('errorRegister', 'This username alredy exist!');
            res.locals.messages = req.flash();
            res.render('register', {
            })
        } else if (checkRegister(data.password) === 1) {
            req.flash('errorRegister', 'Password is to short!');
            res.locals.messages = req.flash();
            res.render('register', {
            })            
        } else {
            console.log('User created!');
            res.redirect('/');  
        }    
    });  
}

//login
function login(req, res) {

    let sql = "SELECT * FROM members WHERE username = ?";
    let data = req.body;
    let insertPassword = req.body.password;

    connectionDb.query(sql, [data.username],  (err, result) => {
        if (err) throw err; 
        if (result.length === 0) {
            req.flash('msg', "Incorect username!");
            res.locals.messages = req.flash();  
            res.render('login', {

            })         
        } else {  
            if (bcrypt.compareSync(insertPassword, result[0].password)) {
                req.session.loggedin = true;
                req.session.username = data.username;
                res.redirect('/')
            } else {
                req.flash('msg', 'Wrong password!');
                res.locals.messages = req.flash();
                res.render('login', {

                })
            }
        }    
    }); 
}

//logout
function logout (req, res) {

    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/');

}

function checkRegister(password) {
    
    if (password.length < 8) {
        return 1;
    } 
    return 0;
}
module.exports = {createTabel, register, login, logout}
 
