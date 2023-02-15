const express = require('express');
const router = express.Router();

router.use('/postgres/users', require('../routes/user-postgres'));
router.use('/neo4j/users', require('../routes/user-neo4j'));
router.use('/postgres/products', require('../routes/product-postgres'));

router.get('/', async(req, res) => {
    res.send('Welcome to the TP-NoSQL API !');
});

module.exports = router;
