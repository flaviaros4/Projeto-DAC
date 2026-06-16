INSERT INTO cliente.clientes
(nome,email,cpf,situacao,telefone,salario,cep,estado,cidade,numero,complemento,logradouro)
SELECT * FROM (VALUES
('Catharyna','cli1@bantads.com.br','12912861012','APROVADO','41999990001',10000,'80000000','PR','Curitiba','100','','Rua A'),
('Cleuddônio','cli2@bantads.com.br','09506382000','APROVADO','41999990002',20000,'80000001','PR','Curitiba','101','','Rua B'),
('Catianna','cli3@bantads.com.br','85733854057','APROVADO','41999990003',3000,'80000002','PR','Curitiba','102','','Rua C'),
('Cutardo','cli4@bantads.com.br','58872160006','APROVADO','41999990004',500,'80000003','PR','Curitiba','103','','Rua D'),
('Coândrya','cli5@bantads.com.br','76179646090','APROVADO','41999990005',1500,'80000004','PR','Curitiba','104','','Rua E')
) AS v(nome,email,cpf,situacao,telefone,salario,cep,estado,cidade,numero,complemento,logradouro)
WHERE NOT EXISTS (SELECT 1 FROM cliente.clientes WHERE cpf = v.cpf);
