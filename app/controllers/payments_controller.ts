import type { HttpContext } from '@adonisjs/core/http'
import Gateway from '#models/gateway'
import Transaction from '#models/transaction'
import axios from 'axios' // Importando o Axios

export default class PaymentsController {
  public async store({ request, response }: HttpContext) {
    const { name, email, amount, cardNumber } = request.all()

    // Buscamos os gateways no banco (Gateway 1 e 2)
    const gateways = await Gateway.query().where('isActive', true).orderBy('priority', 'asc')

    let paymentSuccess = false
    let usedGatewayId = null

    for (const gateway of gateways) {
      try {
        // Definimos a URL baseada no nome que está no banco
        const url = 'https://jsonplaceholder.typicode.com/posts'

        console.log(`Conectando ao ${gateway.name} em ${url}...`)

        // Fazendo a chamada real para o gateway via POST
        const res = await axios.post(url, {
          amount: amount,
          name: name,
          email: email,
          cardNumber: cardNumber,
          cvv: "123" // Valor fixo para o teste nível 1
        })

        // Se o axios não deu erro (status 200 ou 201), deu certo!
        if (res.status === 200 || res.status === 201) {
          paymentSuccess = true
          usedGatewayId = gateway.id
          break // Para o loop, pois já pagou!
        }
      } catch (error) {
        // Se o Gateway 1 falhar (ex: fora do ar), ele cai aqui e o loop tenta o próximo
        console.error(`Falha no ${gateway.name}: ${error.message}`)
      }
    }

    // Salvando o registro da tentativa no seu banco local
    const transaction = await Transaction.create({
      clientName: name,
      clientEmail: email,
      amount: amount,
      status: paymentSuccess ? 'paid' : 'failed',
      cardLastNumbers: cardNumber.slice(-4),
      gatewayId: usedGatewayId,
    })

    if (paymentSuccess) {
      return response.ok({ message: 'Pagamento aprovado via integração!', transactionId: transaction.id })
    }

    return response.badRequest({ message: 'Erro: Nenhum gateway disponível aceitou o pagamento.' })
  }
}