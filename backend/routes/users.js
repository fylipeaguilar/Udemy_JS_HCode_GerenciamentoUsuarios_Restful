// Requisitando o banco NeDB
// Passando as configuracoes para uso do banco
const NeDB = require('nedb')
const db = new NeDB ({
    // Nome do arquivo que queremos criar em disco
    filename: 'users.db',
    autoload: true
})


// ******** SEM O CONSIGN  **************
// const express = require ('express')
// const routes = express.Router();

// ******** COM O CONSIGN  **************

module.exports = (app) => {
    
    let route = app.route('/users')

    route.get((req, res) => {

        // ********* Listar usuários do banco NeDB **********
        // Utilizamos o método "find". Para lista todos passamos apenas "{}"
        // O método "sort" é para ordenar
        //    1: para ordenar de forma ascendente
        //   -1: para ordenar de forma descendente
        // O método "exec" para executar
        db.find({}).sort({ name: 1}).exec((err, users) => {

            if(err) {

                app.utils.error.send(err, req, res)

            } else {

                 res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    // O segundo "users" são os dados que vem direto do banco
                    users: users
                })

            }

        })

        // ************ USANDO O EXPRESS *****************//
        // Exemplo "fixo no código para testes"
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json({
        //     users: [{
        //         name: 'Fylipe',
        //         email: 'fylipears@gmail.com',
        //         id: 1
        //     }]
        // })
    })
    
    route.post((req, res) => {
    
        // ************ USANDO O EXPRESS *****************//
        // res.json(req.body);

       if(!app.utils.validator.user(app, req, res)) return false;

        // Para salvas os dados no banco NeDB dos dados via "post"
        // Passando o objeto json que desejamos salvar, funcao de erro, 
        db.insert(req.body, (err, user) => {

            if(err) {
                
                app.utils.error.send(err, req, res)

             } else {

                res.status(200).json(user);

            }

        })

    })

    // ************* Selecionando apenas 1 elemento ****************//

    let routeId = app.route('/users/:id')

    routeId.get((req, res) => {

        // ********* Listar usuários do banco NeDB **********
        // Utilizamos o método "findOne" para lista apenas um elemento
        // O método "sort" é para ordenar
        //    1: para ordenar de forma ascendente
        //   -1: para ordenar de forma descendente
        // O método "exec" para executar
        db.findOne({ _id:req.params.id }).exec((err, user) => {

            if(err) {

                app.utils.error.send(err, req, res)

            } else {

                res.status(200).json(user);

            }

        })

    })

    // ************* Alterando "update" **********************************//

    routeId.put((req, res) => {

        if(!app.utils.validator.user(app, req, res)) return false;

        // ********* Listar usuários do banco NeDB **********
        // Utilizamos o método "update" para lista apenas um elemento
        db.update({ _id: req.params.id }, req.body, err => {

            if(err) {

                app.utils.error.send(err, req, res)

            } else {

                // res.status(200).json(req.body);

                // Para visualizarmos dando os parametros e o Id
                // Podemos umsar o "object.assign"
                 res.status(200).json(Object.assign(req.params, req.body));

            }

        })

    })

    routeId.delete((req, res) => {

        // O segundo parâmetros é para se queremos excluir multiplos ou apenas 1
        db.remove({ _id: req.params.id }, {}, err => {

            if(err) {

                app.utils.error.send(err, req, res)

            } else {

                // res.status(200).json(req.body);

                // Para visualizarmos dando os parametros e o Id
                // Podemos umsar o "object.assign"
                 res.status(200).json(req.params.id);

            }

        })

    })

}