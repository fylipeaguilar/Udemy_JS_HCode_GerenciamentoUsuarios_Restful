 //************* Estrutura MVC - "C" Controller ******************//


class UserController {

    // Vamos passar como parâmetro o ID do Formulário
    constructor(fromIdCreate, fromIdUpdate, tableId) {

        // Atributo para a guardar o formulário
        this.fromEl = document.getElementById(fromIdCreate);
        this.fromUpdateEl = document.getElementById(fromIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onEdit() {

        document.querySelector('#box-user-update .btn-cancel').addEventListener("click", e => {

            this.showPanelCreate();
        })

        this.fromUpdateEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.fromUpdateEl.querySelector("[type=submit]");         

            btn.disable = true;

            let values = this.getValues(this.fromUpdateEl);

            // console.log(values);

            let index = this.fromUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            // Object.assign ****** É como se fosse um marge
            // Object.assign = Copia o valor de atributos para um objeto,
            //                 Cria um objeto destino, retornmando este objeto
            // O objeto que fica a DIREITA SOBRESCREVE o objeto da ESQUERDA           
            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.fromUpdateEl).then(
                // Primeira função para caso de "sucesso"
                (content) => {

                if (!values.photo) {
                 
                    result._photo = userOld._photo;

                } else {

                    result._photo = content;

                };

                let user = new User();
                 
                user.loadFromJSON(result);

                user.save();

                // Sobreescrevendo os dados do tr criado anteriormente
                this.getTr(user, tr)

                this.updateCount();

                // Limpando o formulário após o cadastro do usuário
                // Para essa acao podemos usar o método reset
                this.fromUpdateEl.reset();

                // Habilitando o botão novamente após o cadastro de um novo usuário
                btn.disable = false;

                this.showPanelCreate();
                    
                },
                // Segunda função para caso de "erro"
                (e) => {
                    console.error(e);
                }
            );

        })
    }

    onSubmit(){

        this.fromEl.addEventListener("submit", (event) => {
            // alert("Cheguei no botão!!!")
        
            // O método "preventDefault" é previbir o padrão, ou seja, no nosso caso,
            // O padrão do submit (form) é enviar o formulário
            // Então, o que estamos fazendo é bloquear o envio do formulário
            // Criando uma aplicação "SPA" Single Page Application (Aplicação de uma única página)
                
            event.preventDefault();
            let btn = this.fromEl.querySelector("[type=submit]");         

            // Desabilitando o botão aque que seja adicionado o usuário
            btn.disable = true;

            let values = this.getValues(this.fromEl)
            // console.log("Valores do formulário: ", values)

            // **************** INICIO DO PROMISE ********************
            // Usando o Promise
            // 1 - Chama o método (neste caso é o "getPhoto")
            // 2 - Usa o método "then" (then = então) (para o caso de sucesso) 
            // e chama a função (acao) a ser realizada para esse caso de sucesso
            // E se der errado, executa a segunda função que é para os casos de erro.

            if(!values) return false;

            this.getPhoto(this.fromEl).then(
                // Primeira função para caso de "sucesso"
                (content) => {

                    values.photo = content;

                    values.save();

                    // ******* IMPORTANTE ******//
                    // O "this" muda de escopo de acordo com a função.
                    // O "this" da forma é referencia a função do "event" 
                    // e não das funções externa
                    // Na nova versão do JS, ** TEMOS ** que usar a função como Arrow Function
                    // let user = this.getValues();

                    this.addLine(values);

                    // Limpando o formulário após o cadastro do usuário
                    // Para essa acao podemos usar o método reset
                    this.fromEl.reset();

                    // Habilitando o botão novamente após o cadastro de um novo usuário
                    btn.disable = false;
                    
                },
                // Segunda função para caso de "erro"
                (e) => {
                    console.error(e);
                }
            );

            // **************** FIM DO PROMISE ********************
        });

    }

    //  ******** API - JS - FILE READER **********
    // Criando um método para ler o caminho da foto
    getPhoto(formEl) {

        // Melhorando o código e usando o Promise (Promessa)
        // O "Resolve" é quando dá certo
        // O "Reject" é quando dá errado
        return new Promise((resolve, reject) => {

            // Criado uma variável para armazenar o objeto do FileReader
            let fileReader = new FileReader();

            // O método filter é nativo do JS, é um método para "filtrar o Array"
            let elements = [...formEl.elements].filter(item => {

                if (item.name === 'photo') {

                    return item;

                }

            });

            let file = elements[0].files[0];

            //Vamos usar também uma função de callback (quando a função terminar)
            fileReader.onload = () => {
                
                resolve(fileReader.result);

            };

            fileReader.onerror = (e) => {

                reject(e);

            }

            if (file){

                fileReader.readAsDataURL(file);

            } else {

                resolve('dist/img/avatar.png');

            };
            
        });

    };


    // Criando um método para montar um JSON
    // com os filhos do formulário
    getValues(fromEl) {

        // Usamos o let para criar uma variável no escopo local
        let user = {};
        let isValid = true;

        // console.log(typeof this.fromEl.elements)
        // O elemets neste caso, são os elementos do "formulário"
        // da nossa aplicação

        // O forEach é usado para array's e neste caso o "fromEl.elements"
        // é um objeto e não um array = gera um erro 
        // Erro: "Uncaught TypeError: this.fromEl.elements.forEach is not a function"
        // this.fromEl.elements.forEach(function(field, index){  *** NÃO PODEMOS USAR ASSIM ****

        // Para essa correção, podemos usar um Spread. Usamos 3 reticências
        [...fromEl.elements].forEach(function(field, index){

            // Analisando se os campos obrigatórios foram preenchidos/
            // Esse "if" abaixo "checa" e os itens são obrigatório
            if (['name', 'email', 'password'].indexOf(field.name) >= 0 && !field.value) {

                // O método "dir" é para ver o resultado como objeto
                field.parentElement.classList.add('has-error');
                isValid = false;                
            }


            if(field.name == 'gender')
            {
                if(field.checked) {
                 
                    user[field.name] = field.value;
                    // console.log(field.checked)
        
                }
                
                // Para guardar o "true ou false" do admin
                } else if (field.name == "admin"){

                    user[field.name] = field.checked;

                } else {
                
                user[field.name] = field.value;
                // console.log("NÃO");
            }    
        
            // console.log(field.id, field.name, field.nodeValue, field.checked, index)
            
        })

        // Checa se todos os dados da valição (neste caso: Nome, Email e Senha) estão preenchidos
        if (!isValid) {
            return false;
        }
    
        //  Instaciando o objeto da Classe "User" do arquivo "models/User.js"
        // Devemos retornar o nosso objectUser
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
            );
        
        // Devemos retornar o nosso objectUser
    }

    // ******************** SESSION E LOCAL STORAGE - INICIO LIST **********************************//

    // O método "secelcAll()" além de buscar os dados do Sesseion Storagem,
    // também vai chamar o método "addLine()" para adicionar os valores em tela
    selectAll() {
    
        // Primeiro precisamos carregar os valores que já existam (caso existam)
        // Então precisamos chegar se tem algum valor
        let users = User.getUsersStorage();

        users.forEach(dataUser => {

            // Tivemos que acrentar o "new User()" aqui pois 
            let user = new User();

            user.loadFromJSON(dataUser);

            this.addLine(user);

        })
    }

    // ******************** SESSION E/OU LOCAL STORAGE - FIM LIST **********************************//

       
    // Criando uma funcao para adicionar linhas
    addLine(dataUser) {

        // console.log(dataUser);
        let tr = this.getTr(dataUser);

        // Para adicionar uma linha e não ficar substituindo
        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    // O valor padrão (tr = null), deixa o parâmetro opcional
        // Se não vir o parâmetro, ele é nulo e fará tal acao com ele nulo
    getTr(dataUser, tr = null){

        if(tr === null)tr = document.createElement('tr')

        // Temos que transformar o objeto para JSON,
        // Pois o método dataSet só armazena valores de string,
        // e o dataUser é um objeto, assim, o valor armazenado seria
        // apenas a palavra "object" e não o conteudo dentro do objeto
        // SERELIALIZANDO.....
        tr.dataset.user = JSON.stringify(dataUser);

        // O "TemplateString" é usado pelas crases "`"
        // Vamos usar um "TemplateString" para adicionar uma parte da tabela (Lista de Usuários)
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${(Utils.dateFormat(dataUser.register))}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat btn-excluir">Excluir</button>
            </td>
        `;
    
        this.addEventTr(tr);

        return tr;

    }



    addEventTr (tr) {

        // Implementando a funcionalidade de excluir
        // Selecionando o botão de excluir
        tr.querySelector(".btn-excluir").addEventListener('click', e => {

            // console.log("Entrei no método excluir");
            if(confirm("Deseja realmente excluir?")) {

                let user = new User();

                // Esterealizando o objeto
                user.loadFromJSON(JSON.parse(tr.dataset.user));

                //Chamando o método de remoção do item na nossa classe User.js
                user.remove();
                
                // console.log("Passei pelo método 'confirme'")
                // Essa linha de comando abaixo, remove apenas da tela
                // Mas não remove do Local Storage
                tr.remove();

                this.updateCount();

            }

        })


        // Implementando a funcionalidade de editar
        // Selecionando o botão de editar
        tr.querySelector(".btn-edit").addEventListener('click', e => {

            // console.log('Cheguei no botão editar', tr)
            let json = JSON.parse(tr.dataset.user);

            // Estamos utilizando a propriedade "sectionRowIndex" que começa a contrar a partir do 0.
            this.fromUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            // Usando o "for In" para percorrer um objeto JSON
            for (let name in json) {
                
                // Todas as nossas variáveis de dentro do JSON estão com "_"
                // Sendo assim temos que usar o método "replace" para retirar o "_"
                let field = this.fromUpdateEl.querySelector("[name = " + name.replace("_","") +"]")

                if(field) {

                    switch (field.type) {

                        case 'file': 
                            continue;
                            break;

                        case 'radio': 
                            field = this.fromUpdateEl.querySelector("[name = " + name.replace("_", "") + "][value=" + json[name] + "]")
                            field.checked = true;
                            break;

                        case 'checkbox':
                            field.checked = json[name];
                            break;

                        default:
                            field.value = json[name];
                        //Obs.: Como esse é o último, não precisa do break
                    }

                }              

            }

            this.fromUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();

        })
    }

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }

    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    updateCount() {

        let numberUsers = 0;
        let numberAdmin = 0;

        // Como o children é uma coleção e  não um array (não podemos usar o forEach),
        // Temos que converter o dados para um array usando o Spread
        [...this.tableEl.children].forEach(tr => {

            numberUsers++;

            // Verificando se na linha do "tr" é um usuário admin ou não.
            // Usando a API do DataSet
            // Fazendo a volta da "string" para objeto
            let user = JSON.parse(tr.dataset.user);

            // Tivemos que usar o "_admin" e não so "admin",
            // Pois que o JSON cria um novo objeto
            // Ele não instancia novamente a classe User
            if(user._admin) numberAdmin++;

        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;
    }
}