INSERT INTO conta_write.contas (cliente, numero, saldo, limite, gerente, criacao)
SELECT * FROM (VALUES
('12912861012','1291', 800.00::numeric,  5000.00::numeric,  '98574307084', '2000-01-01'::timestamp),
('09506382000','0950',-10000.00::numeric,10000.00::numeric, '64065268052', '1990-10-10'::timestamp),
('85733854057','8573',-1000.00::numeric, 1500.00::numeric,  '23862179060', '2012-12-12'::timestamp),
('58872160006','5887', 150000.00::numeric,0.00::numeric,    '98574307084', '2022-02-22'::timestamp),
('76179646090','7617', 1500.00::numeric, 0.00::numeric,     '64065268052', '2025-01-01'::timestamp)
) AS v(cliente,numero,saldo,limite,gerente,criacao)
WHERE NOT EXISTS (SELECT 1 FROM conta_write.contas WHERE numero = v.numero);