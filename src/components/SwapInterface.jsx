"use client"

import { useState, useEffect } from "react"
import "./SwapInterface.css"
import TokenSelector from "./TokenSelector"
import { getExchangeRate } from "../services/tokenService"

const SwapInterface = ({ tokens }) => {
  const [fromToken, setFromToken] = useState(null)
  const [toToken, setToToken] = useState(null)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [rate, setRate] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const savedSwap = localStorage.getItem("swapState")
    if (savedSwap) {
      const { fromTokenName, toTokenName, fromAmount, toAmount } = JSON.parse(savedSwap)

      if (fromTokenName && tokens.length > 0) {
        const foundFromToken = tokens.find((t) => t.name === fromTokenName)
        if (foundFromToken) setFromToken(foundFromToken)
      }

      if (toTokenName && tokens.length > 0) {
        const foundToToken = tokens.find((t) => t.name === toTokenName)
        if (foundToToken) setToToken(foundToToken)
      }

      if (fromAmount) setFromAmount(fromAmount)
      if (toAmount) setToAmount(toAmount)
    } else if (tokens.length > 0) {
      setFromToken(tokens.find((t) => t.name === "USDT") || tokens[0])
      setToToken(tokens.find((t) => t.name === "BTC") || (tokens.length > 1 ? tokens[1] : tokens[0]))
    }
  }, [tokens])

  useEffect(() => {
    if (fromToken && toToken) {
      localStorage.setItem(
        "swapState",
        JSON.stringify({
          fromTokenName: fromToken.name,
          toTokenName: toToken.name,
          fromAmount,
          toAmount,
        }),
      )
    }
  }, [fromToken, toToken, fromAmount, toAmount])

  useEffect(() => {
    if (fromToken && toToken) {
      updateExchangeRate()
    }
  }, [fromToken, toToken])

  const updateExchangeRate = async () => {
    if (!fromToken || !toToken) return

    try {
      const newRate = await getExchangeRate(fromToken, toToken)
      setRate(newRate)

      if (fromAmount) {
        const calculatedAmount = (Number.parseFloat(fromAmount) * newRate).toFixed(6)
        setToAmount(calculatedAmount)
      }
    } catch (error) {
      console.error("Error getting exchange rate:", error)
    }
  }

  const handleFromAmountChange = (e) => {
    const value = e.target.value

    setError("")

    if (value && !/^\d*\.?\d*$/.test(value)) {
      return
    }

    setFromAmount(value)

    if (fromToken && Number.parseFloat(value) > Number.parseFloat(fromToken.available.amount.number)) {
      setError(`Insufficient ${fromToken.name} balance`)
    }

    if (value && rate) {
      const calculatedAmount = (Number.parseFloat(value) * rate).toFixed(6)
      setToAmount(calculatedAmount)
    } else {
      setToAmount("")
    }
  }

  const handleToAmountChange = (e) => {
    const value = e.target.value

    if (value && !/^\d*\.?\d*$/.test(value)) {
      return
    }

    setToAmount(value)

    if (value && rate) {
      const calculatedAmount = (Number.parseFloat(value) / rate).toFixed(6)
      setFromAmount(calculatedAmount)

      if (fromToken && Number.parseFloat(calculatedAmount) > Number.parseFloat(fromToken.available.amount.number)) {
        setError(`Insufficient ${fromToken.name} balance`)
      } else {
        setError("")
      }
    } else {
      setFromAmount("")
    }
  }

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)

    setFromAmount(toAmount)
    setToAmount(fromAmount)

    setError("")
  }

  const handleFromTokenSelect = (token) => {
    if (token.name === toToken?.name) {
      setFromToken(toToken)
      setToToken(fromToken)
    } else {
      setFromToken(token)
    }

    setFromAmount("")
    setToAmount("")
    setError("")
  }

  const handleToTokenSelect = (token) => {
    if (token.name === fromToken?.name) {
      setToToken(fromToken)
      setFromToken(toToken)
    } else {
      setToToken(token)
    }

    setFromAmount("")
    setToAmount("")
    setError("")
  }

  return (
    <div className="swap-interface">
      <h2>Swap Tokens</h2>

      <div className="swap-container">
        <div className="token-input-container">
          <div className="token-input-header">
            <span>From</span>
            {fromToken && (
              <span className="balance">
                Balance: {Number.parseFloat(fromToken.available.amount.number).toLocaleString()} {fromToken.name}
              </span>
            )}
          </div>

          <div className="token-input">
            <input
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="0.0"
              className={error ? "error" : ""}
            />
            <TokenSelector selectedToken={fromToken} tokens={tokens} onSelectToken={handleFromTokenSelect} />
          </div>
        </div>

        <button className="swap-button" onClick={handleSwapTokens}>
          ⇅
        </button>

        <div className="token-input-container">
          <div className="token-input-header">
            <span>To</span>
            {toToken && (
              <span className="balance">
                Balance: {Number.parseFloat(toToken.available.amount.number).toLocaleString()} {toToken.name}
              </span>
            )}
          </div>

          <div className="token-input">
            <input type="text" value={toAmount} onChange={handleToAmountChange} placeholder="0.0" />
            <TokenSelector selectedToken={toToken} tokens={tokens} onSelectToken={handleToTokenSelect} />
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {rate && fromToken && toToken && (
        <div className="exchange-rate">
          1 {fromToken.name} = {rate.toFixed(6)} {toToken.name}
        </div>
      )}

      <button className="swap-action-button" disabled={!fromAmount || !toAmount || !!error}>
        Swap
      </button>
    </div>
  )
}

export default SwapInterface

