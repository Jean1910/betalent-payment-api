import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gateways'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable() // Ex: "Gateway 1" ou "Gateway 2"
      table.boolean('is_active').defaultTo(true) // Se o gateway está ligado
      table.integer('priority').notNullable() // 1 para quem tenta primeiro, 2 para o segundo
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}