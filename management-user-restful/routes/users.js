var express = require('express');
var assert = require('assert'); // Fazendo o require do assert para usá-lo mais em baixo
var router = express.Router();


// **************** Configurando o API do restify ********************//
// Documentação: "http://restify.com/docs/client-guide/"

// Inserindo o require da API dp "Restify"
var restify = require('restify-clients');

// Criando uma declaração de onde está o nosso servico
var client = restify.createJsonClient({

  url: 'http://localhost:4000'

});

// Altenticacao da minha API Restful
// Como não publicamos e não estamos usando autenticação, vamos comentar a linha
// client.basicAuth('$login', '$password');

/* GET users listing. */
// ****** ESSA PARTE JÁ EXISTIA ANTES ******//
router.get('/', function(req, res, next) {

    // Solicitacao GET para uma rota da API Restful
    client.get('/users', function(err, request, response, obj) {
    
      assert.ifError(err);

      // Documentacao
      // console.log(JSON.stringify(obj, null, 2));

      //Vamos jogar o resultado na tela do Express
      res.json(obj)

    });

});


// ******************** GET com "findOne" ********************* //
router.get('/:id', function(req, res, next) {

  // Solicitacao GET para uma rota da API Restful
  client.get(`/users/${req.params.id}`, function(err, request, response, obj) {
  
    assert.ifError(err);

    // Documentacao
    // console.log(JSON.stringify(obj, null, 2));

    //Vamos jogar o resultado na tela do Express
    res.json(obj)

  });

});


// ******************** PUT ********************* //


router.put('/:id', function(req, res, next) {

  // Solicitacao GET para uma rota da API Restful
  client.put(`/users/${req.params.id}`, req.body, function(err, request, response, obj) {
  
    assert.ifError(err);

    // Documentacao
    // console.log(JSON.stringify(obj, null, 2));

    //Vamos jogar o resultado na tela do Express
    res.json(obj)

  });

});


// ******************** DELETE ********************* //

router.delete('/:id', function(req, res, next) {

  // Solicitacao GET para uma rota da API Restful
  // Obs.: O package do restify não usa o delete com onome completo
  // apenas com 3 dígitos "del"
  client.del(`/users/${req.params.id}`, function(err, request, respost, obj) {
  
    assert.ifError(err);

    // Documentacao
    // console.log(JSON.stringify(obj, null, 2));

    //Vamos jogar o resultado na tela do Express
    res.json(obj)

  });

});


// ******************** POST ********************* //

router.post('/', function(req, res, next) {

  // Solicitacao GET para uma rota da API Restful
  // Obs.: O package do restify não usa o delete com onome completo
  // apenas com 3 dígitos "del"
  client.post(`/users/${req.params.id}`, req.body, function(err, request, respost, obj) {
  
    assert.ifError(err);

    // Documentacao
    // console.log(JSON.stringify(obj, null, 2));

    //Vamos jogar o resultado na tela do Express
    res.json(obj)

  });

});

module.exports = router;
