require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')


const courses= require('./courses/fetch_courses')
const exams = require('./exams/fetch_exams')
const progress = require('./progress/progress');
const dashboard = require('./progress/dashboard');
const auth = require('./auth/auth')



app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json())

app.use('/courses', courses)
app.use('/exams',exams)
app.use('/progress', progress);
app.use('/dashboard', dashboard);


app.listen(5000 ,()=>{
    console.log('server is live')
})





