/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
  }
  payments: {
    store: typeof routes['payments.store']
  }
  transactions: {
    index: typeof routes['transactions.index']
    show: typeof routes['transactions.show']
  }
  customers: {
    index: typeof routes['customers.index']
    show: typeof routes['customers.show']
  }
}
