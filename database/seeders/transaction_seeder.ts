import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Transaction from '#models/transaction'
import User from '#models/user'
import Gateway from '#models/gateway'

export default class extends BaseSeeder {
  async run() {
    // 1. Pegamos o usuário admin e os gateways disponíveis
    const admin = await User.findByOrFail('email', 'admin@betalent.tech')
    const gateways = await Gateway.all()

    if (gateways.length === 0) {
      console.log('⚠️ Nenhum gateway encontrado. Rode o GatewaySeeder primeiro!')
      return
    }

    // 2. Criamos 5 transações de teste
    await Transaction.createMany([
      {
        userId: admin.id,
        gatewayId: gateways[0].id,
        amount: 150.50,
        description: 'Venda de Curso de React',
        status: 'completed'
      },
      {
        userId: admin.id,
        gatewayId: gateways[1].id,
        amount: 89.90,
        description: 'Assinatura Mensal Premium',
        status: 'completed'
      },
      {
        userId: admin.id,
        gatewayId: gateways[0].id,
        amount: 1200.00,
        description: 'Venda de Monitor Dell',
        status: 'pending'
      },
      {
        userId: admin.id,
        gatewayId: gateways[1].id,
        amount: 45.00,
        description: 'Ebook de Node.js',
        status: 'reversed'
      },
      {
        userId: admin.id,
        gatewayId: gateways[0].id,
        amount: 320.75,
        description: 'Consultoria Técnica',
        status: 'completed'
      }
    ])
  }
}