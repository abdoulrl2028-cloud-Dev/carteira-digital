// Simulação de API - em produção, conectaria a um servidor real
const API_BASE_URL = 'http://localhost:3000/api'

// Simulação de banco de dados
const mockDatabase = {
  users: JSON.parse(localStorage.getItem('users')) || [],
  transactions: JSON.parse(localStorage.getItem('transactions')) || [],
}

// Salvar dados no localStorage
const saveData = () => {
  localStorage.setItem('users', JSON.stringify(mockDatabase.users))
  localStorage.setItem('transactions', JSON.stringify(mockDatabase.transactions))
}

// Autenticação
export const auth = {
  signup: async (email, password, name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verificar se usuário já existe
        if (mockDatabase.users.find(u => u.email === email)) {
          reject(new Error('Usuário já existe'))
          return
        }

        const newUser = {
          id: Date.now().toString(),
          email,
          password, // Em produção, usar hash
          name,
          balance: 0,
          createdAt: new Date().toISOString(),
        }

        mockDatabase.users.push(newUser)
        saveData()

        resolve({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          balance: newUser.balance,
        })
      }, 500)
    })
  },

  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockDatabase.users.find(
          u => u.email === email && u.password === password
        )

        if (!user) {
          reject(new Error('Email ou senha inválidos'))
          return
        }

        resolve({
          id: user.id,
          email: user.email,
          name: user.name,
          balance: user.balance,
        })
      }, 500)
    })
  },
}

// Transações
export const transactions = {
  getAll: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userTransactions = mockDatabase.transactions.filter(
          t => t.userId === userId
        )
        resolve(userTransactions)
      }, 300)
    })
  },

  create: async (userId, transaction) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockDatabase.users.find(u => u.id === userId)
        if (!user) {
          reject(new Error('Usuário não encontrado'))
          return
        }

        const newTransaction = {
          id: Date.now().toString(),
          userId,
          type: transaction.type, // 'income' ou 'expense'
          amount: parseFloat(transaction.amount),
          category: transaction.category,
          description: transaction.description,
          date: transaction.date,
          createdAt: new Date().toISOString(),
        }

        // Atualizar saldo do usuário
        if (transaction.type === 'income') {
          user.balance += newTransaction.amount
        } else {
          user.balance -= newTransaction.amount
        }

        mockDatabase.transactions.push(newTransaction)
        saveData()

        resolve(newTransaction)
      }, 300)
    })
  },

  delete: async (userId, transactionId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const transaction = mockDatabase.transactions.find(
          t => t.id === transactionId && t.userId === userId
        )

        if (!transaction) {
          reject(new Error('Transação não encontrada'))
          return
        }

        const user = mockDatabase.users.find(u => u.id === userId)
        if (user) {
          if (transaction.type === 'income') {
            user.balance -= transaction.amount
          } else {
            user.balance += transaction.amount
          }
        }

        mockDatabase.transactions = mockDatabase.transactions.filter(
          t => t.id !== transactionId
        )
        saveData()

        resolve({ success: true })
      }, 300)
    })
  },

  getSummary: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userTransactions = mockDatabase.transactions.filter(
          t => t.userId === userId
        )

        const summary = {
          totalIncome: userTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0),
          totalExpense: userTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0),
          byCategory: {},
        }

        userTransactions.forEach(t => {
          if (!summary.byCategory[t.category]) {
            summary.byCategory[t.category] = {
              income: 0,
              expense: 0,
            }
          }

          if (t.type === 'income') {
            summary.byCategory[t.category].income += t.amount
          } else {
            summary.byCategory[t.category].expense += t.amount
          }
        })

        resolve(summary)
      }, 300)
    })
  },
}

export default {
  auth,
  transactions,
}
