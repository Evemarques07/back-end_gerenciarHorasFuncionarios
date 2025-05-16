const express = require("express");
const router = express.Router();
const funcionarioController = require("../controllers/funcionariosController");
const authenticate = require("../middleware/auth"); // Seu middleware de autenticação

/**
 * @swagger
 * components:
 *   schemas:
 *     FuncionarioInput:
 *       type: object
 *       required:
 *         - nome
 *         - cargo_id
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome completo do funcionário.
 *           example: "Carlos Alberto de Nóbrega"
 *         cargo_id:
 *           type: integer
 *           description: "ID do cargo do funcionário."
 *           example: 1
 *     FuncionarioResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "ID único do funcionário."
 *           example: 101
 *         nome:
 *           type: string
 *           description: "Nome completo do funcionário."
 *           example: "Carlos Alberto de Nóbrega"
 *         cargo:
 *           type: string
 *           description: "Nome do cargo do funcionário."
 *           example: "Gerente de Vendas"
 *     FuncionarioCreatedResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "ID do funcionário recém-criado."
 *           example: 102
 *         nome:
 *           type: string
 *           description: "Nome do funcionário."
 *           example: "João da Silva"
 *         cargo_id:
 *           type: integer
 *           description: "ID do cargo do funcionário."
 *           example: 2
 *     SuccessMessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Operação realizada com sucesso."
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Mensagem de erro."
 *         details:
 *           type: object
 *           description: "(Opcional) Detalhes técnicos do erro."
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Funcionários
 *   description: "Operações de CRUD para gerenciar funcionários e seus cargos."
 */

// --- ROTAS ---

/**
 * @swagger
 * /api/funcionarios:
 *   post:
 *     summary: Cria um novo funcionário
 *     tags: [Funcionários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuncionarioInput'
 *     responses:
 *       201:
 *         description: "Funcionário criado com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FuncionarioCreatedResponse'
 *       400:
 *         description: "Dados de entrada inválidos (ex: nome ou cargo_id faltando)."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: "Erro interno do servidor ao tentar criar o funcionário."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", authenticate, funcionarioController.createFuncionario);

/**
 * @swagger
 * /api/funcionarios:
 *   get:
 *     summary: Lista todos os funcionários com seus respectivos cargos
 *     tags: [Funcionários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Uma lista de funcionários."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FuncionarioResponse'
 *       500:
 *         description: "Erro interno do servidor ao buscar os funcionários."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authenticate, funcionarioController.getAllFuncionarios);

/**
 * @swagger
 * /api/funcionarios/{id}:
 *   get:
 *     summary: Busca um funcionário específico pelo ID
 *     tags: [Funcionários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID numérico do funcionário a ser buscado."
 *     responses:
 *       200:
 *         description: "Detalhes do funcionário encontrado."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FuncionarioResponse'
 *       404:
 *         description: "Funcionário com o ID especificado não encontrado para exclusão."

 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: "Erro interno do servidor ao buscar o funcionário."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", authenticate, funcionarioController.getFuncionarioById);

/**
 * @swagger
 * /api/funcionarios/{id}:
 *   put:
 *     summary: Atualiza um funcionário existente pelo ID
 *     tags: [Funcionários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID numérico do funcionário a ser atualizado."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuncionarioInput' # Reutiliza o schema de entrada
 *     responses:
 *       200:
 *         description: "Funcionário atualizado com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *       400:
 *         description: "Dados de entrada inválidos para atualização."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: "Funcionário com o ID especificado não encontrado para atualização. (Nota: Seu controller atual não retorna 404 aqui, mas seria uma boa prática)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: "Erro interno do servidor ao tentar atualizar o funcionário."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", authenticate, funcionarioController.updateFuncionario);

/**
 * @swagger
 * /api/funcionarios/{id}:
 *   delete:
 *     summary: Exclui um funcionário pelo ID
 *     tags: [Funcionários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID numérico do funcionário a ser excluído."
 *     responses:
 *       200:
 *         description: Funcionário excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *       404:
 *         description: "Funcionário com o ID especificado não encontrado para exclusão. (Nota: Seu controller atual não retorna 404 aqui, mas seria uma boa prática)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: "Erro interno do servidor ao tentar excluir o funcionário."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", authenticate, funcionarioController.deleteFuncionario);

module.exports = router;
