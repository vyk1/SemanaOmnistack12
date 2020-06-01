import express from "express";

// No Typescript precisa vir com definição de tipos
// Às vezes vem separada
// E precisa ser adicionada

// Comandos(NOTE:):
// : yarn add @types/express -D
// : yarn add typescript -D
// : yarn add ts-node -D
// : npx tsc --init
// : yarn add ts-node-dev -D

// Não é possível executar Typescript diretamente com o node, portanto,
// Precisa de uma dependência a partir do (:3)

// Para executar essa doideira: 
// 1. npx-> Serve para executar um pacote instalado
//      Binários são scripts executáveis
// 2. configuração com o (:4)
// 3. npx ts-node src/server.ts
const app = express()

app.get('/users', (req, res) => res.json(["Remédios normais não amenizam a pressão", "Também morre quem atira"]))

app.listen(3334)