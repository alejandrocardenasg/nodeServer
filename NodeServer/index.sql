CREATE table radiacion(
    id          int(255) AUTO_INCREMENT NOT NULL,
    uvi         VARCHAR(100) NOT NULL,
    coloruvi    VARCHAR(100) NOT NULL,
    descuvi     VARCHAR(100) NOT NULL,
    CONSTRAINT pk_radiacion PRIMARY KEY(id)
)ENGINE=InnoDB;

CREATE table datos(
    id          int(255) AUTO_INCREMENT NOT NULL,
    nodo        VARCHAR(200) NOT NULL,
    temperatura int(10) NOT NULL,
    humedad     int(10) NOT NULL,         
    sensacion   float NOT NULL,
    radiacion   float NOT NULL,
    id_uv       int(10) NOT NULL,    
    hora        TIME NOT NULL,
    fecha       VARCHAR(200) NOT NULL,
    CONSTRAINT pk_datos PRIMARY KEY(id),
    CONSTRAINT fk_rad FOREIGN KEY(id_uv) REFERENCES radiacion(id)
)ENGINE=InnoDB;

INSERT INTO radiacion VALUES(NULL,'1-2','#43EE1F','Baja');
INSERT INTO radiacion VALUES(NULL,'3-5','#F8F225','Moderada');
INSERT INTO radiacion VALUES(NULL,'6-7','#FF8311','Alta');
INSERT INTO radiacion VALUES(NULL,'8-10','#FF1811','Muy alta');
INSERT INTO radiacion VALUES(NULL,'11-15','#F011FF','Extremadamente alta');


INSERT INTO datos VALUES(NULL,'comuna10',22,60,22.25,120.64,1,'18:35:20',CURDATE());

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON * . * TO 'admin'@'localhost';
FLUSH PRIVILEGES;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'


SELECT u.*, n.nodo AS 'nodo', n.indiceuv AS 'alterta_uv', n.sensacion AS 'alerta_sen', n.lastact AS 'act' FROM datos u INNER JOIN nodos n ON u.id_nodo = n.id WHERE u.id_nodo = 1 GROUP BY u.id_nodo ORDER BY id desc

SELECT u.*, n.nodo AS 'nodo', n.indiceuv AS 'alterta_uv', n.sensacion AS 'alerta_sen', n.lastact AS 'act' FROM datos u ORDER BY u.id desc INNER JOIN nodos n ON u.id_nodo = n.id WHERE u.id_nodo = 1 GROUP BY u.id_nodo