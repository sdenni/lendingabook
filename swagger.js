module.exports = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title : "Lending a Book API",
      version: '1.0.0',
      description: 'API untuk memanage buku yang dipinjam oleh member',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
}