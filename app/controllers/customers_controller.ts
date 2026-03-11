import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'

export default class CustomersController {
  async index({ response }: HttpContext) {
    const customers = await Customer.query().orderBy('fullName', 'asc')
    return response.ok(customers)
  }

  async show({ params, response }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    return response.ok(customer)
  }
}