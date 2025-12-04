import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { transactions } from '../services/api'
import TransactionList from '../components/TransactionList'
import '../styles/Home.css'

export default function Home({ user, onLogout }) {
  const [transactionsList, setTransactionsList] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const [transactionsData, summaryData] = await Promise.all([
        transactions.getAll(user.id),
        transactions.getSummary(user.id),
      ])
      setTransactionsList(transactionsData.sort((a, b) => new Date(b.date) - new Date(a.date)))
      setSummary(summaryData)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Tem certeza que deseja deletar essa transação?')) return

    try {
      await transactions.delete(user.id, transactionId)
      setTransactionsList(transactionsList.filter(t => t.id !== transactionId))
      // Recarregar resumo
      const newSummary = await transactions.getSummary(user.id)
      setSummary(newSummary)
    } catch (err) {
      console.error('Erro ao deletar transação:', err)
    }
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <h1>💰 Carteira Digital</h1>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="welcome">
          <h2>Olá, {user.name}!</h2>
          <p>Bem-vindo à sua carteira digital</p>
        </section>

        <section className="balance-section">
          <div className="balance-card">
            <h3>Saldo Total</h3>
            <div className={`balance-amount ${user.balance >= 0 ? 'positive' : 'negative'}`}>
              R$ {user.balance.toFixed(2).replace('.', ',')}
            </div>
          </div>

          {summary && (
            <>
              <div className="summary-card income">
                <h4>💵 Receitas</h4>
                <p>R$ {summary.totalIncome.toFixed(2).replace('.', ',')}</p>
              </div>

              <div className="summary-card expense">
                <h4>💸 Despesas</h4>
                <p>R$ {summary.totalExpense.toFixed(2).replace('.', ',')}</p>
              </div>
            </>
          )}
        </section>

        <section className="actions">
          <Link to="/new-transaction" className="btn-primary btn-large">
            ➕ Nova Transação
          </Link>
        </section>

        <section className="transactions-section">
          <h3>Últimas Transações</h3>
          {transactionsList.length > 0 ? (
            <TransactionList
              transactions={transactionsList}
              onDelete={handleDeleteTransaction}
            />
          ) : (
            <p className="empty-state">Nenhuma transação registrada ainda.</p>
          )}
        </section>
      </main>
    </div>
  )
}
