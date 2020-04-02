// ******** SEM O CONSIGN  **************
// const express = require ('express')
// const routes = express.Router();

// ******** COM O CONSIGN  **************
module.exports = (app) => {

    // Linha de comando para subir com o express
    // Não precisamos usar o comando "createServer", apenas o método da nossa rota
    app.get('/', (req, res) => {

        // ************ USANDO O EXPRESS *****************//
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Olá!!!</h1>')

    })

// Temos que usar o export para passar os dados para um outro arquivo
// ******** SEM O CONSIGN  **************
// module.exports = routes;

};