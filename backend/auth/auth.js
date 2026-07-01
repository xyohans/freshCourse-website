
const supabase = require('../supabaseClient');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Ask Supabase to verify the token and return the user
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user; // now every route can use req.user.id
    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Auth check failed' });
  }
};

module.exports = requireAuth;