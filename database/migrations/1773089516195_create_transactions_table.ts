import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      // Relacionamentos: Quem vendeu e por onde passou o dinheiro
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('gateway_id').unsigned().references('id').inTable('gateways').onDelete('SET NULL')

      table.decimal('amount', 10, 2).notNullable() // Valor da venda
      table.string('description').nullable()       // O que foi vendido
      table.string('status').defaultTo('pending')  // pending, completed, reversed

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}