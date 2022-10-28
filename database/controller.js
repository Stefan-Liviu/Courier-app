const connectionDb = require('./database');
const bcrypt = require('bcrypt');
const salt = 10;

//create tabel

function createTabel() {
    
    let sql = "CREATE TABLE IF NOT EXISTS members (id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, username TEXT UNIQUE NOT NULL, levelAccess TEXT, password TEXT NOT NULL, email VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL)"
    connectionDb.query(sql, (err) => {
        if (err) throw err;
    })
}

//register function

function register(req, res) {

    let data = req.body;
    let hash = bcrypt.hashSync(data.password, salt);
    let time = new Date();
    let levelAccess = 'normal';

    let sql = "INSERT INTO members (id, username, password, levelAccess, email, created_at) VALUES ?";
    let value = [
        [0, data.username, hash, levelAccess, data.email, time]
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

//login function

function login(req, res) {

    let sql = "SELECT * FROM members WHERE username = ?";
    let data = req.body;
    let insertPassword = req.body.password;

    connectionDb.query(sql, [data.username],  (err, result) => {
        if (err) throw err; 
        if (result.length === 0) {
            req.flash('msg', "Incorect username!");
            res.locals.messages = req.flash();  
            res.render('/user/login', {

            })         
        } else {  
            if (bcrypt.compareSync(insertPassword, result[0].password)) {
                req.session.loggedin = true;
                req.session.username = data.username; 
                req.session.levelAccess = result[0].levelAccess;             
                res.redirect('/');
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

//print information about profile

function profile(req, res) {
    let username = req.session.username;
    let sql = "SELECT * FROM members WHERE username = ?";
    connectionDb.query(sql, [username], (err, result) => {
     if (err) {
         throw err;
     } else {
         res.render('myAccount', {
             user: result[0],
         })
     }
    })
 }
 
 //display all the members

 function members(req, res) {
     if (checkLevelAccess(req) === 1) {
        errorMessage(req, res);         
     } else {
         let sql = 'SELECT * FROM members'
         connectionDb.query(sql, (err, result) => {
         if (err) throw err;
         res.render('members', {
             result: result
         });
     }); 
     }    
 }


 //edit user 

 function editUser(req, res) {
    if (checkLevelAccess(req) === 1) {
        errorMessage(req, res); 
    } else {
        let sql = "Select * FROM members WHERE id = ?";
        connectionDb.query(sql, req.params.id, (err, result) => {
        if (err) throw err;
            res.render('editUser', {
            result: result[0]
        });
    });
    }
    
 }

 //update user

 function updateUser(req, res) {
    if (checkLevelAccess(req) === 1) {
        errorMessage(req, res); 
    } else {
        let id = req.params.id;
        let sql = "UPDATE members SET ? WHERE id = ?";
    
        connectionDb.query(sql, [{username: req.body.username, levelAccess: req.body.levelAccess, email: req.body.email}, id], (err, result) => {
            if (err) throw err;
            res.redirect('/admin/members')
        });
    }
 }

 //delete user

 function deleteUser(req, res) {
    if (checkLevelAccess(req) === 1) {
        errorMessage(req, res); 
    } else {
        let sql = "DELETE FROM members WHERE id = ?";
        connectionDb.query(sql, req.params.id, (err, result) => {
        if (err) throw err;
        res.redirect('/admin/members')
    });
    }
 }

 //new route

 function newRoute(req, res) {
    if (checkLevelAccess(req) === 1) {
        errorMessage(req, res); 
    } else {
        res.render('newRoute');
    }
 }


 //dispalay error message

 function errorMessage(req, res) {
    req.flash('msg', 'Not permission on this page!');
    res.locals.messages = req.flash();
    res.render('404', {
 
    });
 }

 //Is checking level access

function checkLevelAccess(req) {
    if (req.session.levelAccess != 'admin') {
       return 1;
    } else {
        return 0;
    } 
}
 
module.exports = {createTabel, register, login, logout, checkLevelAccess, profile, members, editUser, updateUser, deleteUser, newRoute}
 