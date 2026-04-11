const express = require('express');
const con =require('./db_connect')
const router = express.Router()


router.use(express.json());


//insert to a database (create)
router.post('/', async (req, res) => {
    const { name, email, pass } = req.body
    try {
        await con.query(`insert into stud values(? , ? , ?)`, [name, email, pass])
        res.json({
            message: "data is inserted "
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err })
    }
})

module.exports = router