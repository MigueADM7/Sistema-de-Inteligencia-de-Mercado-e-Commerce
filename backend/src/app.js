const express = require('express');
const cors = require('cors');
const productController = require('./controllers/ProductController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Montar el controlador bajo el prefijo /api exigido en el reto
app.use('/api', productController);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`[Servidor] Backend ejecutándose en http://localhost:${PORT}`);
});