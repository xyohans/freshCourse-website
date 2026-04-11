//CRUD operation 
const express = require('express');
const app = express();


const signup = require('./signup');
const read = require('./read')
const update = require('./update');
const deleteUser = require('./delete')




app.use(express.static('./static'));
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json());


//CRUD OPS
app.use('/signup', signup);
app.use('/read' , read);
app.use('/update' , update);
app.use('/delete' , deleteUser)

app.listen(5173, () => console.log("server is running...."))