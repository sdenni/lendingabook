const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions = require('./swagger');

/**
 * ROUTES
 */
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const lendRoutes = require('./routes/lendRoutes');

const app = express();
app.use(express.json());

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/lends', lendRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
  console.log(`server is running on port ${PORT}`);
});

module.exports = app;