const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Criar novo usuário
exports.createUser = async (req, res) => {
  const { email, senha, funcionario_id } = req.body;

  if (!email || !senha || !funcionario_id) {
    return res
      .status(400)
      .json({ error: "Preencha todos os campos obrigatórios." });
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    const [result] = await db.query(
      "INSERT INTO usuarios (email, senha, funcionario_id) VALUES (?, ?, ?)",
      [email, hashedPassword, funcionario_id]
    );

    res.status(201).json({ id: result.insertId, email });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário.", details: err });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ error: "Usuário não encontrado" });

    const usuario = rows[0];
    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

    if (!isPasswordValid)
      return res.status(401).json({ error: "Senha inválida" });

    const token = jwt.sign(
      { id: usuario.id, funcionario_id: usuario.funcionario_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, usuario: { id: usuario.id, email: usuario.email } });
  } catch (err) {
    res.status(500).json({ error: "Erro ao realizar login.", details: err });
  }
};

// Listar usuários
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.email, f.nome AS funcionario 
      FROM usuarios u 
      LEFT JOIN funcionarios f ON u.funcionario_id = f.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários.", details: err });
  }
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ message: "Usuário excluído com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir usuário.", details: err });
  }
};
