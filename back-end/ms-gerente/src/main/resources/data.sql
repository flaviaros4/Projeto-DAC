INSERT INTO gerente.gerentes (cpf, nome, email, tipo, telefone, data_criacao)
SELECT * FROM (VALUES
  ('98574307084', 'Geniéve',    'ger1@bantads.com.br', 'GERENTE', '41999991001', NOW()),
  ('64065268052', 'Godophredo', 'ger2@bantads.com.br', 'GERENTE', '41999991002', NOW()),
  ('23862179060', 'Gyândula',   'ger3@bantads.com.br', 'GERENTE', '41999991003', NOW())
) AS v(cpf, nome, email, tipo, telefone, data_criacao)
WHERE NOT EXISTS (SELECT 1 FROM gerente.gerentes WHERE cpf = v.cpf);

INSERT INTO gerente.conta (cpf_cliente, numero_conta, saldo, limite, cpf_gerente, criacao_conta)
SELECT * FROM (VALUES
  ('12912861012', '1291',  800.00::numeric,     5000.00::numeric,  '98574307084', '2000-01-01'),
  ('09506382000', '0950',  -10000.00::numeric,  10000.00::numeric, '64065268052', '1990-10-10'),
  ('85733854057', '8573',  -1000.00::numeric,   1500.00::numeric,  '23862179060', '2012-12-12'),
  ('58872160006', '5887',  150000.00::numeric,  0.00::numeric,     '98574307084', '2022-02-22'),
  ('76179646090', '7617',  1500.00::numeric,    0.00::numeric,     '64065268052', '2025-01-01')
) AS v(cpf_cliente, numero_conta, saldo, limite, cpf_gerente, criacao_conta)
WHERE NOT EXISTS (SELECT 1 FROM gerente.conta WHERE numero_conta = v.numero_conta);
