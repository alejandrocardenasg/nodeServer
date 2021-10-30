const {Router} = require('express');
const router = Router();
const db = require('../mongodb.js');

var temperatura; // se pueden declarar variables globales para ser usadas en el get y en el post

router.get('/prueba', async(req,res) =>{
    
    console.log(req.body);

    /*
    result = await db.insertOne("");
    */
    res.send("Sirve");
    
});

router.post('/add', async (req,res) => {

    var json = req.body;

    datos_radiacion = getUVI(json.radiacion);
    
    json.uvi = datos_radiacion.uvi;
    json.coloruvi = datos_radiacion.coloruvi;
    json.descuvi = datos_radiacion.descuvi;
    console.log(json);

    await db.insertOne(json);

    res.send("OK");

});

router.get('/show', async (req,res) =>{

    datos = await db.getAll();

    res.send(datos);

});

//FUNCION GET UVI

function getUVI(radiacion){
    let UVI = "";
    let colorUVI = "";
    let UVI_esp = "";

    if(radiacion >= 0 && radiacion <= 199){
        UVI = "1 - 2";
        colorUVI = "#43EE1F";
        UVI_esp = "Baja";
    }
    if(radiacion >= 200 && radiacion <= 499){
        UVI = "3 - 5";
        colorUVI = "#F8F225";
        UVI_esp = "Moderada"
    }
    if(radiacion >= 500 && radiacion <= 699){
        UVI = "6 - 7";
        colorUVI = "#FF8311";
        UVI_esp = "Alta";
    }
    if(radiacion >= 700 && radiacion <= 999){
        UVI = "8 - 10";
        colorUVI = "#FF1811";
        UVI_esp = "Muy alta";
    }
    if(radiacion >= 1000 && radiacion <= 1500){
        UVI = "11 - 15";
        colorUVI = "#F011FF";
        UVI_esp = "Extremadamente alta";
    }

    salida = {};
    salida.uvi = UVI;
    salida.coloruvi = colorUVI;
    salida.descuvi = UVI_esp;

    return salida;

}

module.exports = router