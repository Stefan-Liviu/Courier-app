const mysql = require('mysql');

const connectionDb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'courierApp',
    port: '3306'
});

connectionDb.connect(function(error) {
    if(error) throw error;
    console.log('Connected to Database')
});

module.exports = connectionDb;