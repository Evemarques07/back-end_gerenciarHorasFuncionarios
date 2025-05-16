const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuariosController");
const authenticate = require("../middleware/auth"); // Seu middleware de autenticação

/**
 * @swagger
 * components:
 *   schemas:
 *     UserInput:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *         - funcionario_id
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: "Endereço de email único para o usuário."
 *           example: "joao.silva@example.com"
 *         senha:
 *           type: string
 *           format: password
 *           description: "Senha do usuário (será hasheada no backend)."
 *           example: "SenhaForte123!"
 *         funcionario_id:
 *           type: integer
 *           description: "ID do funcionário associado a este usuário."
 *           example: 15
 *     UserCreatedResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "ID do usuário recém-criado."
 *           example: 7
 *         email:
 *           type: string
 *           format: email
 *           description: "Email do usuário criado."
 *           example: "joao.silva@example.com"
 *     UserLoginInput:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "joao.silva@example.com"
 *         senha:
 *           type: string
 *           format: password
 *           example: "SenhaForte123!"
 *     UserLoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: "Token JWT para autenticação."
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZnVuY2lvbmFyaW9faWQiOjE1LCJpYXQiOjE2NzgwNjIwNzcsImV4cCI6MTY3ODA2NTY3N30.abcdef123456"
 *         usuario:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 7
 *             email:
 *               type: string
 *               format: email
 *               example: "joao.silva@example.com"
 *     UserListResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 7
 *         email:
 *           type: string
 *           format: email
 *           example: "joao.silva@example.com"
 *         funcionario:
 *           type: string
 *           description: "Nome do funcionário associado (pode ser null se o funcionário for excluído)."
 *           example: "João da Silva"
 *     # Reutilizando SuccessMessageResponse e ErrorResponse do arquivo de funcionários
 *     # Se este arquivo for separado, defina-os aqui também ou importe-os de um local comum.
 *     # Exemplo (caso não estejam no mesmo contexto de Swagger):
 *     # SuccessMessageResponse:
 *     #   type: object
 *     #   properties:
 *     #     message:
 *     #       type: string
 *     #       example: "Operação realizada com sucesso."
 *     # ErrorResponse:
 *     #   type: object
 *     #   properties:
 *     #     error:
 *     #       type: string
 *     #       example: "Mensagem de erro."
 *     #     details:
 *     #       type: object
 *     #       description: "(Opcional) Detalhes técnicos do erro."
 *   securitySchemes:
 *     bearerAuth: # Já definido no arquivo de funcionários, mas bom ter aqui se for um arquivo separado.
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: "Gerenciamento de usuários e autenticação (login/registro)."
 */

// --- ROTAS ---

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um novo usuário (registro)
 *     tags: [Usuários]
 *     description: "Cria um novo usuário associado a um funcionário existente."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: "Usuário criado com sucesso. Retorna o ID e email do novo usuário."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCreatedResponse'
 *       400:
 *         description: "Dados de entrada inválidos (ex: campos obrigatórios faltando)."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse' # Assumindo que ErrorResponse está definido globalmente ou importado
 *       500:
 *         description: "Erro interno do servidor ao tentar criar o usuário (ex: email duplicado, erro no banco)."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", usuarioController.createUser); // Rota para criar usuário (não protegida por padrão)

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Usuários]
 *     description: "Permite que um usuário faça login com email e senha para obter um token de acesso."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginInput'
 *     responses:
 *       200:
 *         description: "Login realizado com sucesso. Retorna o token e informações básicas do usuário."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLoginResponse'
 *       401:
 *         description: "Credenciais inválidas (usuário não encontrado ou senha incorreta)."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: "Erro interno do servidor durante o processo de login."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", usuarioController.login);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários registrados
 *     tags: [Usuários]
 *     description: "Retorna uma lista de todos os usuários com seus emails e nomes de funcionários associados. Requer autenticação."
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Uma lista de usuários."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         description: "Não autorizado (token JWT inválido ou ausente)."
 *       500:
 *         description: "Erro interno do servidor ao buscar os usuários."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authenticate, usuarioController.getAllUsers); // Rota protegida

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     tags: [Usuários]
 *     description: "Remove um usuário do sistema. Requer autenticação."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID numérico do usuário a ser excluído."
 *     responses:
 *       200:
 *         description: "Usuário excluído com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse' # Assumindo que SuccessMessageResponse está definido globalmente ou importado
 *       401:
 *         description: "Não autorizado (token JWT inválido ou ausente)."
 *       404:
 *         description: "Usuário com o ID especificado não encontrado para exclusão. (Nota: Seu controller atual não retorna 404 aqui, mas seria uma boa prática)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: "Erro interno do servidor ao tentar excluir o usuário."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", authenticate, usuarioController.deleteUser); // Rota protegida

module.exports = router;
