const express = require('express');
const con = require('./db_connect')
const router = express.Router();

router.use(express.json())

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        const [data] = await con.query(`select name , email from stud where email='${email}'`);
        console.log(data)
        res.status(200).json({
            result: data,
            message: "data retrived "
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
});

module.exports = router;