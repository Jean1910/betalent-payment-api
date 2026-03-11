import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'

export default class User extends BaseModel {
  // Esse método agora funciona de verdade!
  static async verifyCredentials(email: string, password: string) {
    const user = await this.findBy('email', email)
    if (!user) return null

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) return null

    return user
  }

  // Se o seu controller usa User.accessTokens, precisamos inicializar isso
  static accessTokens: any 

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}