const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/docs/swagger");
const initDatabase = require("./src/config/initDB"); // Importar função de criação

dotenv.config();

const app = express();
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas principais
app.use("/api/usuarios", require("./src/routes/usuarios.routes"));
app.use("/api/funcionarios", require("./src/routes/funcionarios.routes"));

// Inicia banco e servidor
initDatabase().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`);
  });
});
