const express = require('express');

const server = express();
server.use(express.json());

// server.get('/teste', (req, res) => { // parametros e resposta por query params
//     const name = req.query.nome // consumindo query params "?nome=Luiz"

//     return res.json( { message: `olá ${name}`, id: 1} );
// });
const users = ['Luiz', 'Augusto', 'Bruno', 'Carlos', 'Zanoni', 'Lucas', 'Jonathan'];

server.use((req, res, next) => { //middleware global
    console.log(`Método: ${req.method}; URL: ${req.url}`)
    return next();
})

function checkUserExist(req, res, next) { //middleware local
    if(!req.body.name) {
        return res.status(400).json({ error: 'User name is required' });
    }

    return next();
}

function checkUserInArry(req, res, next) {
    const user = users[req.params.index];
    if(!user) {
        return res.status(400).json({ error: 'User does not exist' });
    }

    req.user = user;

    return next(); 
}

server.get('/users/:index', checkUserInArry, (req, res) => { // parametros e resposta por route params // retorno de um usuário
    const { index } = req.params; // com destruturação const id = req.params.id // sem destruturação

    return res.json( req.user ); //return res.json( users[index] );
});

server.get('/users', (req, res) => { // retorno de todos os usuário
   
    return res.json( users );
});

server.post('/users', checkUserExist, (req, res) => { // criação de um usuário
    const { name } = req.body; 
    users.push(name);

    return res.json( users );
});

server.put('/users/:index', checkUserInArry, checkUserExist, (req, res) => { // atualização de um usuário
    const { index } = req.params;
    const { name } = req.body;
    
    users[index] = name;
    
    return res.json( users );
});

server.delete('/users/:index', checkUserInArry, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);

    return res.send();

});

server.listen(3000); // localhost:3000