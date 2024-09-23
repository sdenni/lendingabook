const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const swaggerOptions = require('./swagger');

const app = express();
app.use(express.json());

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
  console.log(`server is running on port ${PORT}`);
});

module.exports = app;