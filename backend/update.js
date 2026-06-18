// const express = require('express');
// const router = express.Router();
// const con = require('./db_connect');

// router.use(express.json());


// router.put('/', async (req, res) => {
//     const { name, email } = req.body;
//     try {
//         await con.query(`update stud set name='${name}' where email='${email}'`);
//         res.json({
//             n: name,
//             message: "updated"
//         })
//     } catch (err) {
//         res.json({
//             message: "error occured"
//         })
//         console.log(err)
//     }

// })

// module.exports = router;