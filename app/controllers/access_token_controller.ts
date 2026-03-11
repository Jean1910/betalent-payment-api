import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AccessTokenController {
  /**
   * Realiza o login, valida as credenciais e retorna o token de acesso
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = request.all()

    try {
      // 1. Busca e valida o usuário (Note o 'await' essencial)
      const user = await User.verifyCredentials(email, password) as User

      // 2. Se as credenciais estiverem erradas, o método retorna null
      if (!user) {
        return response.unauthorized({ message: 'E-mail ou senha inválidos' })
      }

      // 3. Criamos o token usando o usuário validado
      const token = await User.accessTokens.create(user)

      return response.ok({
        message: 'Login realizado com sucesso!',
        token: token.value!.release(),
        user: {
          email: user.email,
          role: user.role
        }
      })
    } catch (error) {
      // Caso ocorra algum erro técnico ou de banco
      return response.unauthorized({ message: 'E-mail ou senha inválidos' })
    }
  }

  /**
   * Realiza o logout revogando o token atual do usuário
   */
  async destroy({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      
      if ('currentAccessToken' in user && user.currentAccessToken) {
        await User.accessTokens.delete(
          user, 
          (user.currentAccessToken as any).identifier
        )
      }
      
      return response.ok({ message: 'Logged out successfully' })
    } catch (error) {
      return response.badRequest({ message: 'Não foi possível realizar o logout' })
    }
  }
}