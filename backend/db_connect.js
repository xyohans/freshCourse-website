
const mysql = require('mysql2/promise');

//create a connection to mysql database
const con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'fresh_course'
})

module.exports = con