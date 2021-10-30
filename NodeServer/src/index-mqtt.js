const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost')

client.on('connect', function () {
    client.subscribe('topico1', function (err) {
        if (err) {
            console.log("error en la subscripcion")
        }
    })
});

client.on('message', function (topic, message) {
    // message is Buffer
    json1 = JSON.parse(message.toString()); //de esta manera se convierte el mensaje recibido en un json
    temperatura = json1.temp; //de esta manera se obtiene un valor asociado a una clave en el json
    console.log(message.toString())
    client.publish('topico2', 'mensaje recibido')
    //client.end() //si se habilita esta opción el servicio termina
});
