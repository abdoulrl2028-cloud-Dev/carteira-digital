import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { transactions } from '../services/api'
import '../styles/NewTransaction.css'

export default function NewTransaction({ user }) {
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('Alimentação')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const categories = {
    expense: ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Diversão', 'Outros'],
    income: ['Salário', 'Freelance', 'Investimentos', 'Bônus', 'Outros'],
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!amount || parseFloat(amount) <= 0) {
      setError('Digite um valor válido')
      return
    }

    setLoading(true)

    try {
      await transactions.create(user.id, {
        type,
        category,
        amount,
        description,
        date,
      })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTypeChange = (newType) => {
    setType(newType)
    setCategory(categories[newType][0])
  }

  return (
    <div className="new-transaction-container">
      <header className="header">
        <h1>💰 Nova Transação</h1>
      </header>

      <main className="transaction-form-container">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Voltar
        </button>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="type-selector">
            <label>Tipo de Transação:</label>
            <div className="type-buttons">
              <button
                type="button"
                className={`type-btn ${type === 'income' ? 'active income' : ''}`}
                onClick={() => handleTypeChange('income')}
              >
                💵 Receita
              </button>
              <button
                type="button"
                className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
                onClick={() => handleTypeChange('expense')}
              >
                💸 Despesa
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Valor *</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoria *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Data *</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes sobre a transação..."
              rows="4"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary btn-large">
            {loading ? 'Registrando...' : 'Registrar Transação'}
          </button>
        </form>
      </main>
    </div>
  )
}
