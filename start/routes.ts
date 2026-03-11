import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Definição dos caminhos dos Controllers
const AuthController = () => import('#controllers/access_token_controller')
const PaymentsController = () => import('#controllers/payments_controller')
const TransactionsController = () => import('#controllers/transactions_controller')
const CustomersController = () => import('#controllers/customers_controller') // <--- ADICIONADO

router.get('/', async () => {
  return { 
    status: 'API Online', 
    message: 'Desafio BeTalent - Gerenciador de Pagamentos' 
  }
})

// Rota de Login (Pública)
router.post('/login', [AuthController, 'login'])

// Rotas Protegidas (Exigem o Token no Header)
router.group(() => {
  
  // Checkout de Pagamento
  router.post('/checkout', [PaymentsController, 'store'])

  // Listagem de Transações (Nível 2)
  router.get('/transactions', [TransactionsController, 'index'])
  router.get('/transactions/:id', [TransactionsController, 'show'])

  // Listagem de Clientes (Nível 3) - ADICIONADO
  router.get('/customers', [CustomersController, 'index'])
  router.get('/customers/:id', [CustomersController, 'show'])

}).use(middleware.auth())