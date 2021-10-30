CREATE table nodos(
    id          int(255) AUTO_INCREMENT NOT NULL,
    nodo        VARCHAR(255) NOT NULL,
    indiceuv    VARCHAR(255) NOT NULL,
    sensacion   VARCHAR(255) NOT NULL,
    lastact     VARCHAR(255) NOT NULL,
    CONSTRAINT pk_radiacion PRIMARY KEY(id)
)ENGINE=InnoDB;

CREATE table datos(
    id          int(255) AUTO_INCREMENT NOT NULL,
    id_nodo     int(255) NOT NULL,
    temperatura int(10) NOT NULL,
    humedad     int(10) NOT NULL,         
    sensacion   float NOT NULL,
    radiacion   VARCHAR(200) NOT NULL,  
    hora        TIME NOT NULL,
    fecha       VARCHAR(200) NOT NULL,
    CONSTRAINT pk_datos PRIMARY KEY(id),
    CONSTRAINT fk_datos FOREIGN KEY(id_nodo) REFERENCES nodos(id)
)ENGINE=InnoDB;

CREATE table ubicaciones(
    id          int(255) AUTO_INCREMENT NOT NULL,
    id_nodo     int(255) NOT NULL,
    latitud    VARCHAR(255) NOT NULL,
    longitud   VARCHAR(255) NOT NULL,
    CONSTRAINT pk_ubicaciones PRIMARY KEY(id),
    CONSTRAINT fk_ubicaciones FOREIGN KEY(id_nodo) REFERENCES nodos(id)
)ENGINE=InnoDB;

INSERT INTO ubicaciones VALUES(NULL, 1, '15642', '31251');
INSERT INTO ubicaciones VALUES(NULL, 2, '15642', '31251');