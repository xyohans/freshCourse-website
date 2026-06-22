
// const mysql = require('mysql2/promise');

// //create a connection to mysql database
// const con = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '1234',
//     database: 'fresh_course'
// })

// module.exports = con

const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = process.env.SUPABASE_URL;

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

module.exports = supabase;
