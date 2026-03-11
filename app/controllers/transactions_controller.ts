import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'

export default class TransactionsController {
  /**
   * Lista todas as transações com os dados do Gateway e Usuário inclusos
   */
  async index({ response }: HttpContext) {
    try {
      const transactions = await Transaction.query()
        .preload('gateway') // Traz os dados do Gateway automaticamente
        .preload('user', (query) => {
          query.select('id', 'email') // Traz apenas o essencial do usuário por segurança
        })
        .orderBy('createdAt', 'desc')

      return response.ok(transactions)
    } catch (error) {
      return response.internalServerError({ 
        message: 'Erro ao listar transações', 
        error: error.message 
      })
    }
  }

  /**
   * Exibe uma transação específica por ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const transaction = await Transaction.query()
        .where('id', params.id)
        .preload('gateway')
        .preload('user')
        .firstOrFail()

      return response.ok(transaction)
    } catch (error) {
      return response.notFound({ message: 'Transação não encontrada' })
    }
  }
}