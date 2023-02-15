const swaggerAutogen = require('swagger-autogen')();

const endpointsFiles = ['../server/api.js'];
const outputFile = './swagger-doc.json';

const doc = {
    info: {
        version: '1.0.0',
        title: 'NoSQL API',
        description: 'NoSQL API Documentation'
    },
    host: '',
    basePath: '/api',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Users',
            description: 'User Endpoints'
        },
        {
            name: 'Products',
            description: 'Product Endpoints'
        }
    ]
};

swaggerAutogen(outputFile, endpointsFiles, doc);
