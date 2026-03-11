import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash' // Adicione esse import

export default class extends BaseSeeder {
  async run() {
    await User.query().where('email', 'admin@betalent.tech').delete()

    const hashedPassword = await hash.make('123') // Criptografa manualmente aqui

    await User.create({
      email: 'admin@betalent.tech',
      password: hashedPassword, // Salva a senha já protegida
      role: 'ADMIN',
    })
  }
}