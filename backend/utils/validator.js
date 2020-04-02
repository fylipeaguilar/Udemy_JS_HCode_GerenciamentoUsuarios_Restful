module.exports = {

    user: (app, req, res) => {

// Usando o método "expressValidator" para validação dos dados
        // assert(campo, mensagem).validacao
        // notEmpty coloca obrigatoriedade para o campo não se vazio
        req.assert('name', 'O nome é obrigatório').notEmpty();
        req.assert('email', 'O nome está inválido').notEmpty().isEmail();

        let errors = req.validationErrors();

        // Se o método validationErros estiver falhas, o array dele terá dados
        if(errors) {

            // Se tiver algum erro, vamos querer mostrar os dados na tela
            app.utils.error.send(errors, req, res);
            return false;

        } else {

            return true

        }

    }

}