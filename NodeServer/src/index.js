const express = require('express'); //se indica que se requiere express
const path = require('path');
const app = express(); // se inicia express y se instancia en una constante de nombre app.
const morgan = require('morgan'); //se indica que se requiere morgan
// settings
app.set('port', 9000); //se define el puerto en el cual va a funcionar el servidro
// Utilities
app.use(morgan('dev')); //se indica que se va a usar morgan en modo dev
app.use(express.json()); //se indica que se va a usar la funcionalidad para manejo de json de
app.use(express.urlencoded({extended:true}));
//Routes
app.use(require('./rutas/index.js'));
//app.use(require('./rutas/index-mongo.js'));
//Start server
app.listen(app.get('port'), ()=> {
console.log("Servidor funcionando");
}); //se inicia el servidor en el puerto definido y se pone un mensaje en la consola.
