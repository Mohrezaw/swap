import "./Header.css"

const Header = ({ totalValue }) => {
  return (
    <header className="header">
      <h1>Swap Wallet</h1>
      {totalValue && totalValue.length > 0 && (
        <div className="total-value">
          <div className="value-item">
            <span className="value-label">Total Value (IRT):</span>
            <span className="value-amount">{Number(totalValue[0].number).toLocaleString()}</span>
          </div>
          <div className="value-item">
            <span className="value-label">Total Value (USD):</span>
            <span className="value-amount">${Number(totalValue[1].number).toLocaleString()}</span>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

