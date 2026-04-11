
const mysql = require('mysql2/promise');

//create a connection to mysql database
const con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
})

module.exports = con