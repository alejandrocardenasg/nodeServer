const {Router} = require('express');
const router = Router();
const db = require('../db.js');

router.get('/p', (req,res) =>{
    sql = "SELECT id FROM nodos WHERE nodo = ?";
    db.query(sql, ["comuna_15"], function (err, result) {
        if (err) throw err;

        var datos = result[0];
        console.log(datos.id);
        res.send(datos.id.toString());
    });
})

router.post('/add', (req,res) => {

    var datos_json = req.body;

    let indice_uv = getUVI(datos_json.radiacion);
    let uv = getAlertaUv(datos_json.radiacion);
    let sensacion = getAlertaSensacion(datos_json.sensacion);
    let actualizacion = "Ultima actualización a las " + datos_json.hora + " del " + datos_json.fecha;
    
    var sql = "SELECT * FROM nodos WHERE nodo = ?";

    db.query(sql, [datos_json.nodo] , function (err, result) {
        if (err) throw err;

        datos = result[0];

        if(datos){
            console.log("Este nodo ya esta registrado");

            sql = "UPDATE nodos SET indiceuv = ?, sensacion = ?, lastact = ?  WHERE nodo = ?";
            values = [uv, sensacion, actualizacion,datos_json.nodo];
            db.query(sql, values, function (err, result){
                if(err){
                    console.log(err);
                }else{
                    console.log("Registro insertado");
                }

            });

        }else{
            sql = "INSERT INTO nodos VALUES ?";
            var values = [
                [0, datos_json.nodo, uv, sensacion, actualizacion]
            ];
            console.log(values);
            db.query(sql, [values], function (err, result){
                if(err){
                    console.log(err);
                }else{
                    console.log("Registro insertado");
                }

            });

            sql = "SELECT * FROM nodos WHERE nodo = ?";
            db.query(sql, [datos_json.nodo], function (err, result) {
                if (err) throw err;
        
                dato = result[0];
                
                sql = "INSERT INTO ubicaciones VALUES ?"

                var values = [
                    [0, dato.id, "0.0", "0.0"]
                ];
                console.log(values);
                db.query(sql, [values], function (err, result){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Registro insertado");
                    }
    
                });

            });

        }


        sql = "SELECT id FROM nodos WHERE nodo = ?";
        db.query(sql, [datos_json.nodo], function (err, result) {
            if (err) throw err;
    
            var datos = result[0];
            let id = datos.id;

            sql = "INSERT INTO datos VALUES ?";
            var values = [
                [0, id, datos_json.temperatura, datos_json.humedad, datos_json.sensacion, indice_uv, datos_json.hora , datos_json.fecha]
            ]

            db.query(sql, [values], function (err, result){
                if(err){
                    console.log("No se pudo ejecutar la consulta");
                }
            });

            res.send("OK")

        });

    }); 

});

router.get('/nodos', async (req,res) =>{


    var datos;
    var sql = "SELECT * FROM nodos";
    db.query(sql , function (err, result) {
        if (err) throw err;

        datos = result;
        res.send(datos);
    });


});

router.get('/nodo/:id', async (req,res) =>{

    id = req.params.id;

    var datos;
    var sql = "SELECT * FROM nodos WHERE id = ?";
    db.query(sql, id , function (err, result) {
        if (err) throw err;

        datos = result;
        res.send(datos);
    });


});

router.get('/datos', async (req,res) =>{

    var datos;
    var sql = "SELECT * FROM datos";
    db.query(sql , function (err, result) {
        if (err) throw err;

        datos = result;
        res.send(datos);
    });


});

router.get('/datos/nodo/:id', async (req,res) =>{

    id = req.params.id;

    var datos;
    var sql = "SELECT * FROM nodos WHERE id = ?";
    db.query(sql,id, function (err, result) {
        if (err) throw err;

        datos = result;

        var sql = "SELECT * FROM datos WHERE id_nodo = ?";
        db.query(sql,id, function (err, result) {
            if (err) throw err;
    
            datos.push(result);
    
            res.send(datos);
        });
    });


});

router.get('/nodoT', async (req,res)=>{

    let sql = "SELECT u.*, n.nodo AS 'nodo' FROM ubicaciones u ";
    sql = sql + "INNER JOIN nodos n ON u.id_nodo = n.id"
    db.query(sql, function (err, result) {
        if (err) throw err;

        datos = result;
        res.send(datos);
    });


})

router.get('/datosT/:id', async(req,res) =>{
    
    let id = req.params.id;
    let sql = "SELECT * FROM nodos WHERE id = ?";

    db.query(sql, id, function (err, result) {
        if (err) throw err;
        datos = result[0];

        sql = "SELECT * FROM datos WHERE id_nodo = ? ORDER BY id DESC limit 1"

        db.query(sql, id, function (err, result) {
            if (err) throw err;
            let newDatos = result[0];
            datos.temperatura = newDatos.temperatura;
            datos.humedad = newDatos.humedad;
            datos.dsensacion = newDatos.sensacion;
            datos.radiacion = newDatos.radiacion;
    
            res.send(datos);
        });

    });

})

router.get("/Nodoubicacion/:id", async(req,res) =>{

    var id = req.params.id;
    var sql = "SELECT * FROM ubicaciones WHERE id_nodo = ?";
    db.query(sql, id , function (err, result){
        if (err) throw err;

        datos = result;
        res.send(datos);
    });


})

router.post('/datos/nodo/seg/:id', async(req,res) =>{

    id = req.params.id;

    fechas = req.body;

    var datos;
    var sql = "SELECT * FROM nodos WHERE id = ?";
    db.query(sql,id, function (err, result) {
        if (err) throw err;

        datos = result;

        var sql = "SELECT * FROM datos WHERE id_nodo = ? AND fecha BETWEEN ? AND ?";
        db.query(sql,[id, fechas.ini, fechas.fin], function (err, result) {
            if (err) throw err;
    
            datos.push(result);
    
            res.send(datos);
        });
    });

})

router.post('/addCoorNodo/:id', async (req,res) =>{

    var id = req.params.id;

    var datos = req.body;
    url = req.headers.referer + "administrar";

    let sql = "UPDATE ubicaciones SET latitud = ?, longitud = ? WHERE id_nodo = ?";

    var values = [datos.lat, datos.lon, id];

    db.query(sql, values, function (err, result){
        if(err){
            console.log("No se pudo ejecutar la consulta");
            console.log(err);
        }
    });

    res.redirect(url);
 
});

router.get('/eliminar/:id', async(req,res) =>{

    var id = req.params.id;

    url = req.headers.referer + "administrar";

    let sql = "DELETE FROM datos WHERE id_nodo = ?";

    var values = id;

    db.query(sql, values, function (err, result){
        if(err){
            console.log("No se pudo ejecutar la consulta");
            console.log(err);
        }
    });

    sql = "DELETE FROM ubicaciones WHERE id_nodo = ?";

    db.query(sql, values, function (err, result){
        if(err){
            console.log("No se pudo ejecutar la consulta");
            console.log(err);
        }
    });

    sql = "DELETE FROM nodos WHERE id = ?";

    db.query(sql, values, function (err, result){
        if(err){
            console.log("No se pudo ejecutar la consulta");
            console.log(err);
        }
    });


    res.redirect(url);

})



//FUNCION GET UVI
function getUVI(radiacion){
    let salida;

    if(radiacion >= 0 && radiacion <= 199){
        salida = "1-2";
    }
    if(radiacion >= 200 && radiacion <= 499){
        salida = "3-5";
    }
    if(radiacion >= 500 && radiacion <= 699){
        salida = "6-7";
    }
    if(radiacion >= 700 && radiacion <= 999){
        salida = "8-10";
    }
    if(radiacion >= 1000 && radiacion <= 1500){
        salida = "11-15";
    }

    return salida;

}

function getAlertaSensacion(sensacion){

    let alerta;

    if(sensacion >= 0 && sensacion < 18){
        alerta = "Deberías abrigarte";
    }
    if(sensacion >= 18 && sensacion < 25){
        alerta = "Clima amigable";
    }
    if(sensacion >= 25 && sensacion < 32){
        alerta = "Ha comenzado a hacer calor, deberías hidratarte";
    }
    if(sensacion >= 32 && sensacion < 40.5){
        alerta = "Hidrátate! Podrías presentar calambras por calor y agotamiento";
    }
    if(sensacion >= 40.5 && sensacion <48){
        alerta = "Ten cuidado, podrías presentar agotamiento extremo por calor";
    }
    if(sensacion >= 48){
        alerta = "Refúgiate! Podrías presentar hipertermia";
    }

    return alerta;

}

function getAlertaUv(radiacion){
    let salida;

    if(radiacion >= 0 && radiacion <= 199){
        salida = "Puedes circular normalmente";
    }
    if(radiacion >= 200 && radiacion <= 499){
        salida = "Considera usar protección basica y bloqueador solar";
    }
    if(radiacion >= 500 && radiacion <= 699){
        salida = "Usa bloqueador solar, gorros y no te expongas por mucho tiempo al sol";
    }
    if(radiacion >= 700 && radiacion <= 999){
        salida = "No te expongas mucho al sol, puede ser peligroso";
    }
    if(radiacion >= 1000 && radiacion <= 1500){
        salida = "No salgas, estas exxpuesto a condiciones peligrosas de radiación solar";
    }

    return salida;

}

module.exports = router