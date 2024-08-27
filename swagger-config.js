import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js'];

const doc = {
  info: {
    title: 'API Documentation',
    description: 'API Documentation',
    version: '1.0.0',
  },
  host: 'localhost:8080',
  basePath: '/',
  schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => {
    require('./index.js');
  })
  .catch((err) => {
    console.error(err);
  });