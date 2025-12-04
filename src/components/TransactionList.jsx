import '../styles/TransactionList.css'

export default function TransactionList({ transactions, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }

  return (
    <div className="transaction-list">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className={`transaction-row ${transaction.type}`}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.description || 'Sem descrição'}</td>
              <td>{transaction.category}</td>
              <td>
                <span className={`badge ${transaction.type}`}>
                  {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                </span>
              </td>
              <td className={`amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(transaction.id)}
                  title="Deletar transação"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
