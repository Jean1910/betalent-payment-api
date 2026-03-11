import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import env from '#start/env' // Garanta que este import existe

const dbConfig = defineConfig({
  /**
   * Mudamos aqui para ler do .env ou usar mysql por padrão
   */
  connection: env.get('DB_CONNECTION') || 'mysql',

  connections: {
    /**
     * Configuração do MySQL (Ativada)
     */
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_HOST'),
        port: Number(env.get('DB_PORT')),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },

    /**
     * Mantemos o SQLite aqui apenas como reserva
     */
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig