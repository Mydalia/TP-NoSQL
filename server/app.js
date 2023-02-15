const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

const compression = require('compression');

const api = require('./api');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger/swagger-doc.json');

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.disable('x-powered-by');

app.use(compression());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', api);
app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = () => app.listen(port, () => {
    console.log(`TP-NoSQL app listening on port ${port}`);
});
