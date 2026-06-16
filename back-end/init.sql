CREATE SCHEMA IF NOT EXISTS gerente;
CREATE SCHEMA IF NOT EXISTS cliente;
CREATE SCHEMA IF NOT EXISTS conta_write;
CREATE SCHEMA IF NOT EXISTS conta_read;


CREATE TABLE conta_read.contas (
    id BIGSERIAL PRIMARY KEY,
    cliente VARCHAR(255),
    numero VARCHAR(50),
    saldo NUMERIC(15,2),
    limite NUMERIC(15,2),
    gerente VARCHAR(11),
    criacao TIMESTAMP
);

CREATE TABLE conta_read.transacoes (
    id BIGSERIAL PRIMARY KEY,
    data_hora TIMESTAMP,
    tipo VARCHAR(20),
    valor NUMERIC(15,2),
    conta_origem_id BIGINT,
    conta_destino_id BIGINT,
    CONSTRAINT fk_origem FOREIGN KEY (conta_origem_id)
        REFERENCES conta_read.contas(id),
    CONSTRAINT fk_destino FOREIGN KEY (conta_destino_id)
        REFERENCES conta_read.contas(id)
);

CREATE TABLE conta_write.contas (
    id BIGSERIAL PRIMARY KEY,
    cliente VARCHAR(255),
    numero VARCHAR(50),
    saldo NUMERIC(15,2),
    limite NUMERIC(15,2),
    gerente VARCHAR(11),
    criacao TIMESTAMP
);

CREATE TABLE conta_write.transacoes (
    id BIGSERIAL PRIMARY KEY,
    data_hora TIMESTAMP,
    tipo VARCHAR(20),
    valor NUMERIC(15,2),
    conta_origem_id BIGINT,
    conta_destino_id BIGINT,
    CONSTRAINT fk_origem_write FOREIGN KEY (conta_origem_id)
        REFERENCES conta_write.contas(id),
    CONSTRAINT fk_destino_write FOREIGN KEY (conta_destino_id)
        REFERENCES conta_write.contas(id)
);


INSERT INTO conta_read.contas (cliente, numero, saldo, limite, gerente, criacao)
VALUES
    ('12912861012', '1291',  800.00,    5000.00, '98574307084', '2000-01-01 00:00:00'),
    ('09506382000', '0950',  -10000.00, 10000.00,'64065268052', '1990-10-10 00:00:00'),
    ('85733854057', '8573',  -1000.00,  1500.00, '23862179060', '2012-12-12 00:00:00'),
    ('58872160006', '5887',  150000.00, 0.00,    '98574307084', '2022-02-22 00:00:00'),
    ('76179646090', '7617',  1500.00,   0.00,    '64065268052', '2025-01-01 00:00:00');

INSERT INTO conta_read.transacoes (data_hora, tipo, valor, conta_origem_id, conta_destino_id)
VALUES
    ('2020-01-01 10:00:00', 'DEPOSITO',     1000.00, 1, NULL),
    ('2020-01-01 11:00:00', 'DEPOSITO',     900.00,  1, NULL),
    ('2020-01-01 12:00:00', 'SAQUE',        550.00,  1, NULL),
    ('2020-01-01 13:00:00', 'SAQUE',        350.00,  1, NULL),
    ('2020-01-10 15:00:00', 'DEPOSITO',     2000.00, 1, NULL),
    ('2020-01-15 08:00:00', 'SAQUE',        500.00,  1, NULL),
    ('2020-01-20 12:00:00', 'TRANSFERENCIA',1700.00, 1, 2),
    ('2025-01-01 12:00:00', 'DEPOSITO',     1000.00, 2, NULL),
    ('2025-01-02 10:00:00', 'DEPOSITO',     5000.00, 2, NULL),
    ('2025-01-10 10:00:00', 'SAQUE',        200.00,  2, NULL),
    ('2025-02-05 10:00:00', 'DEPOSITO',     7000.00, 2, NULL),
    ('2025-05-05 10:00:00', 'DEPOSITO',     1000.00, 3, NULL),
    ('2025-05-06 10:00:00', 'SAQUE',        2000.00, 3, NULL),
    ('2025-06-01 10:00:00', 'DEPOSITO',     150000.00,4, NULL),
    ('2025-07-01 10:00:00', 'DEPOSITO',     1500.00, 5, NULL);


INSERT INTO conta_write.contas (cliente, numero, saldo, limite, gerente, criacao)
VALUES
    ('12912861012', '1291',  800.00,    5000.00, '98574307084', '2000-01-01 00:00:00'),
    ('09506382000', '0950',  -10000.00, 10000.00,'64065268052', '1990-10-10 00:00:00'),
    ('85733854057', '8573',  -1000.00,  1500.00, '23862179060', '2012-12-12 00:00:00'),
    ('58872160006', '5887',  150000.00, 0.00,    '98574307084', '2022-02-22 00:00:00'),
    ('76179646090', '7617',  1500.00,   0.00,    '64065268052', '2025-01-01 00:00:00');

INSERT INTO conta_write.transacoes (data_hora, tipo, valor, conta_origem_id, conta_destino_id)
VALUES
    ('2020-01-01 10:00:00', 'DEPOSITO',     1000.00, 1, NULL),
    ('2020-01-01 11:00:00', 'DEPOSITO',     900.00,  1, NULL),
    ('2020-01-01 12:00:00', 'SAQUE',        550.00,  1, NULL),
    ('2020-01-01 13:00:00', 'SAQUE',        350.00,  1, NULL),
    ('2020-01-10 15:00:00', 'DEPOSITO',     2000.00, 1, NULL),
    ('2020-01-15 08:00:00', 'SAQUE',        500.00,  1, NULL),
    ('2020-01-20 12:00:00', 'TRANSFERENCIA',1700.00, 1, 2),
    ('2025-01-01 12:00:00', 'DEPOSITO',     1000.00, 2, NULL),
    ('2025-01-02 10:00:00', 'DEPOSITO',     5000.00, 2, NULL),
    ('2025-01-10 10:00:00', 'SAQUE',        200.00,  2, NULL),
    ('2025-02-05 10:00:00', 'DEPOSITO',     7000.00, 2, NULL),
    ('2025-05-05 10:00:00', 'DEPOSITO',     1000.00, 3, NULL),
    ('2025-05-06 10:00:00', 'SAQUE',        2000.00, 3, NULL),
    ('2025-06-01 10:00:00', 'DEPOSITO',     150000.00,4, NULL),
    ('2025-07-01 10:00:00', 'DEPOSITO',     1500.00, 5, NULL);