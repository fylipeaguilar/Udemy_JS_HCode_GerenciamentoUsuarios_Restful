 //************* Estrutura MVC - "M" Model ******************//

class User {

    // O nome da variável não necessita ser o mesmo nome do atributo
    // Mas por uma questão de entendimento é interessante colocar
    // Obs.: Colocar "nome" amigáveis
    constructor(name, gender, birth, country, email, password, photo, admin) {

        // Criando os atributos da classe
        // Usando a convenção para e usar o "_" no nome do atributo

        // O atributo "this._id" foi implementado para ser usado com no Local Storage
        this._id;

        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    // ******************** GETTERES E SETTERES ******************
    // Criando os getters e setters para propriedades privadas
    
    // ******************** CRIANDO OS GETTERES  ******************
    
    // O método get para "this._id" foi implementado para ser usado com no Local Storage
    get id () {
        return this._id;
    }
    
    
    get name () {
        return this._name;
    }

    get gender () {
        return this._gender;
    }

    get birth () {
        return this._birth;
    }

    get country () {
        return this._country;
    }

    get email () {
        return this._email;
    }

    get password () {
        return this._password;
    }

    get photo () {
        return this._photo;
    }

    get admin () {
        return this._admin;
    }

    get register () {
        return this._register;
    }

    // ******************** CRIANDO OS SETTERES  ******************

    // O método set para "this._id" foi implementado para ser usado com no Local Storage
    
    set name (value){
        this._name = value;
    }

    set gender (value){
        this._gender = value;
    }

    set birth (value){
        this._birth = value;
    }

    set country (value){
        this._country = value;
    }

    set email (value){
        this._email = value;
    }

    set password (value){
        this._password = value;
    }

    set photo (value){
        this._photo = value;
    }

    set admin (value){
        this._admin = value;
    }

    set register (value){
        this._register = value;
    }

    loadFromJSON(json){
        
        // For In: para cada "name" que encontrar no "json", "faça" (funcao)
        for (let name in json) {
        
            // Esse switch é para verificar e armazenar as variáveis em sus formatos corretos
            switch(name) {

                case '_register':
                    this[name] = new Date(json[name]);
                    // this[name] = Utils.dateFormat(json[name])
                    break;

                default:
                    // name é o nome de cada um dos atributos
                    this[name] = json[name]
            }
        }
    }

    // ******************** SESSION E LOCAL STORAGE - INICIO - CARREGA DADOS DO STRAGE *************//
    
    //Como ele não usa o this, ele pode ser um método static
    static getUsersStorage() {

        // ********************** NOVO - REST API ********************************** //
    
            return Fetch.get('/users');

        
        // ********************** ANTES - LOCAL STORAGE ********************************** //
        // // Temos que trabalhar com um array, pois dentro de um objeto,
        // // Temos muitos "atributos"/variáveis diferentes para ser armazenadas
        // let users = [];
        
        // // Primeiro precisamos carregar os valores que já existam (caso existam)
        // // Então precisamos chegar se tem algum valor
        
        // // --------> Usando o SessionStorage
        // // if(sessionStorage.getItem("users")) {
        
        // // --------> Usando o LocalStorage
        // if(localStorage.getItem("users")) {

        //     // Transforma o objeto num array
        //     users = JSON.parse(localStorage.getItem("users"))

        // }

        // return users;
        // ************************************************************************************** //
    }


    // Estamos criando o método "toJSON" para converter o 
    // nosso objeto instanciado para JSON
    toJSON() {

        let json = {};

        // Object.keys: Lê as chaves do nosso objeto
        Object.keys(this).forEach( key => {

            // Fazendo uma verificação para não salvar dados undefined
            if(this[key] !== undefined) {
                
                json[key] = this[key]
                
            }

        })

        return json;

    }



    // O save é um modelo que o dado será salvo. E não a regra de negócio da aplicação
    save() {

        // ************ CODIFICACAO PARA SALVAR OS DADOS NO NeDB ***************************//

        // Criando uma nova promessa para avisar o resultado para quem chamou o método save()
        return new Promise((resolve, reject) => {

            //Como os dois cenários retornam uma promessa...
            let promise;


            if(this.id){

                promise = HttpRequest.put(`/users/${this.id}`, this.toJSON())

            } else {

                promise = HttpRequest.post('/users', this.toJSON())

            }

            promise.then(data => {

                this.loadFromJSON(data);

                // Neste caso passamos o this que é o proprio objeto instanciado
                resolve(this);

            }).catch (e => {

                reject(e);

            });

        });

        // ************ CODIFICACAO PARA SALVAR OS DADOS NO LOCALSTORAGE *******************//

        // // Primeiro precisamos carregar os valores que já existam (caso existam)
        // // Então precisamos chegar se tem algum valor
        // let users = User.getUsersStorage();

        // // ****** DEBUG ******
        // // console.log("Entrei no método save e o objeto desse usuário é: ", users)

        // // Utilizando o recurso do ID (Chave Unica) para salvar na Local Storage
        // if(this.id > 0) {

        //     // ****** DEBUG ******
        //     // console.log("Entrei na verificação de ID > 0: ", this.id)

        //     // O método "map", além de mapear (encontrar), permite já alterar o array
        //     users.map( u => {
               
        //         if(u._id == this.id) {

        //             // Mescla pra mim o próprio "u" com o que está vindo do "this"
        //             Object.assign(u, this);

        //         }

        //         // console.log("Passei pelo return do método map:" , u)
        //         return u;

        //     });
        
        // } else {

        //     // ****** DEBUG *******
        //     // console.log("Entrei na verificação do else e meu objeto é: ", users)

        //     // Como estou dentro da minha classe, eu posso manipular 
        //     // propriedade privada (neste caso o this._id)
        //     this._id = this.getNewID();
            
        //     // ****** DEBUG *******
        //     // console.log(this._id);


        //     // Adicionando os novos dados com o método push
        //     users.push(this);
        //     // console.log(this)

        //     // Session Storage trabalha com key/value (chave/valor)
        //     // Session Storage não salva os dados do objeto, apenas passando o objeto
        //     // tem que retirar o conteudo de dentro, para ser salvo

        //     // --------- Usando o Session Storage ---------------//
        //     // sessionStorage.setItem("users",JSON.stringify(users))

        // }

        // // // *** DEBUG ***
        // // console.log("Vou executar o processo para salvar no Local Stage")

        // // --------- Usando o Local Storage ---------------//
        // localStorage.setItem("users",JSON.stringify(users))
        // // console.log("Entrou dentro do método insert e os valores de user são: ", sessionStorage)
        
        // ****************************************************************************************//
        
    }

    remove() {

        // Neste caso a nosso "promise é esse próprio return"
        return HttpRequest.delete(`/users/${this.id}`);

        // ***************************** ANTIGO - APAGANDO DO LOCAL STORAGE ********************************************//
        // // Primeiro precisamos carregar os valores que já existam (caso existam)
        // // Então precisamos chegar se tem algum valor
        // let users = User.getUsersStorage();
        // // console.log(users)
        
        // // Identificando os dados dentro do objeto pelo array
        // users.forEach((userData, index) => {

        //     if(this._id == userData._id) {

        //         // ******** DEBUG ********
        //         // console.log(userData, index)

        //         // O método splice remove do Local Storage
        //         // Syntaxe: users.splice(index, 1), quer dizer que vai remover "1" elemento após o indice encontrado
        //         users.splice(index, 1);

        //     }
            
        // });

        // // Guardando os dados que sobraram do array no Local Storage

        // // --------- Usando o Local Storage ---------------//
        // localStorage.setItem("users",JSON.stringify(users))
        // // console.log("Entrou dentro do método insert e os valores de user são: ", sessionStorage)
        // ******************************************************************************************************************//

    }
    
}