CREATE DATABASE atividade;

USE atividade;

CREATE TABLE carro(
    car_codigo INT NOT NULL AUTO_INCREMENT,
    car_nome VARCHAR(100) NOT NULL,
    CONSTRAINT pk_carro PRIMARY KEY(car_codigo)
);

CREATE TABLE peca(
    pec_codigo INT NOT NULL AUTO_INCREMENT,
    pec_descricao VARCHAR(100) NOT NULL,
    pec_preco DECIMAL(10,2) NOT NULL DEFAULT 0,
    pec_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
    car_codigo INT NOT NULL,
    CONSTRAINT pk_peca PRIMARY KEY(pec_codigo),
    CONSTRAINT fk_carro FOREIGN KEY(car_codigo) REFERENCES carro(car_codigo)
);

CREATE TABLE proprietario (
    prop_codigo INT NOT NULL AUTO_INCREMENT,
    prop_nome VARCHAR(100) NOT NULL,
    CONSTRAINT pk_proprietario PRIMARY KEY (prop_codigo)
);
CREATE TABLE IF NOT EXISTS compra (
    comp_codigo INT NOT NULL AUTO_INCREMENT,
    car_codigo INT NOT NULL,
    prop_codigo INT NOT NULL,
    CONSTRAINT pk_compra PRIMARY KEY (comp_codigo),
    CONSTRAINT fk_carro FOREIGN KEY (car_codigo) REFERENCES carro(car_codigo),
    CONSTRAINT fk_proprietario FOREIGN KEY (prop_codigo) REFERENCES proprietario(prop_codigo)
);
