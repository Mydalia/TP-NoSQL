const express = require('express');
const router = express.Router();

router.use('/postgres/users', require('../routes/user-postgres'));
router.use('/postgres/products', require('../routes/product-postgres'));

router.get('/', async(req, res) => {
    res.send('Welcome to the NoSQL API !');
});

module.exports = router;
