const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.json());

const { routes } = require('./src/routes/routes');

app.use('/', routes); 


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});