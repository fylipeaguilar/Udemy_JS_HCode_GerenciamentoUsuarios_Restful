module.exports = {

    send: (err, req, res, code = 400) =>  {

        // Mensagem com o erro gerado pela aplicacao
        console.log(`Errors: ${err}`)

        // Podemos usar o método para apresentar o status.
        // O código 400 é para informar: "o servidor não pode ou não irá processar
        // a requisição devido a alguma coisa"
        res.status(code).json({

            error: err
            
        })

    }

}