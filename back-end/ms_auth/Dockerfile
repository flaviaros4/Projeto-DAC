# Dockerfile para o microserviço de autenticação
# Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
#Imagem base para a fase de build, com Maven e JDK 17
COPY . /app 
#Copia o código-fonte para o diretório /app dentro do container
WORKDIR /app 
# Define o diretório de trabalho para os comandos seguintes
RUN mvn clean package -DskipTests
# Executa o comando Maven para compilar o projeto e gerar o arquivo JAR, pulando os testes


#Execução
FROM eclipse-temurin:17-jre-alpine
#Imagem base para a fase de execução, com JDK 17
COPY --from=build /app/target/*.jar app.jar
#Copia o arquivo JAR gerado na fase de build para o diretório raiz do container, renomeando-o para app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
# Define o comando de entrada para executar o aplicativo Java quando o container for iniciado