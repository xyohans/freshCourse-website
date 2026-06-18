// const express = require('express');
// const router = express.Router();
// const con = require('./db_connect');

// router.use(express.json());


// router.delete('/', async (req, res) => {
//     const { email } = req.body;
//     try {
//         await con.query(`delete from stud where email = '${email}'`);
//         res.json({
//             message: "deleted"
//         })
//     } catch (err) {
//         res.json({
//             message: "error occured"
//         })
//         console.log(err)
//     }

// })

// module.exports = router;