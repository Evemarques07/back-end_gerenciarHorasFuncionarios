const db = require("../config/db");

// Criar funcionário
exports.createFuncionario = async (req, res) => {
  const { nome, cargo_id } = req.body;

  if (!nome || !cargo_id) {
    return res.status(400).json({ error: "Nome e cargo são obrigatórios." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO funcionarios (nome, cargo_id) VALUES (?, ?)",
      [nome, cargo_id]
    );
    res.status(201).json({ id: result.insertId, nome, cargo_id });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar funcionário.", details: err });
  }
};

// Listar todos os funcionários com nome do cargo
exports.getAllFuncionarios = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.id, f.nome, c.nome AS cargo
      FROM funcionarios f
      LEFT JOIN cargos c ON f.cargo_id = c.id
    `);
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao buscar funcionários.", details: err });
  }
};

// Buscar funcionário por ID
exports.getFuncionarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT f.id, f.nome, c.nome AS cargo
       FROM funcionarios f
       LEFT JOIN cargos c ON f.cargo_id = c.id
       WHERE f.id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Funcionário não encontrado" });

    res.json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao buscar funcionário.", details: err });
  }
};

// Atualizar funcionário
exports.updateFuncionario = async (req, res) => {
  const { id } = req.params;
  const { nome, cargo_id } = req.body;

  try {
    await db.query(
      "UPDATE funcionarios SET nome = ?, cargo_id = ? WHERE id = ?",
      [nome, cargo_id, id]
    );
    res.json({ message: "Funcionário atualizado com sucesso." });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar funcionário.", details: err });
  }
};

// Deletar funcionário
exports.deleteFuncionario = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM funcionarios WHERE id = ?", [id]);
    res.json({ message: "Funcionário excluído com sucesso." });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao excluir funcionário.", details: err });
  }
};
