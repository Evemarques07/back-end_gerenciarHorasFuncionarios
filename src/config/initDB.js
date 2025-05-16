const mysql = require("mysql2/promise");
require("dotenv").config();

async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );
    console.log(
      `✅ Banco de dados '${process.env.DB_NAME}' verificado/criado.`
    );

    await connection.changeUser({ database: process.env.DB_NAME });

    await connection.query(`
      CREATE TABLE IF NOT EXISTS cargos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS funcionarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cargo_id INT,
        FOREIGN KEY (cargo_id) REFERENCES cargos(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        funcionario_id INT,
        FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
      )
    `);

    await connection.end();
    console.log("✅ Tabelas verificadas/criadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error);
  }
}

module.exports = initDatabase;
