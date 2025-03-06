"use client"

import { useEffect, useState } from "react"
import "./App.css"
import Header from "./components/Header"
import { getTokenData } from "./services/tokenService"
import SwapInterface from "./components/SwapInterface"

function App() {
  const [tokens, setTokens] = useState([])
  const [totalValue, setTotalValue] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedData = localStorage.getItem("swapWalletData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setTokens(parsedData.tokens)
      setTotalValue(parsedData.totalValue)
      setIsLoading(false)
    } else {
      fetchTokenData()
    }
  }, [])

  const fetchTokenData = async () => {
    setIsLoading(true)
    try {
      const response = await getTokenData()
      setTokens(response.result.tokens)
      setTotalValue(response.result.totalValue)

      localStorage.setItem(
        "swapWalletData",
        JSON.stringify({
          tokens: response.result.tokens,
          totalValue: response.result.totalValue,
        }),
      )
    } catch (error) {
      console.error("Error fetching token data:", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="app">
      <Header totalValue={totalValue} />
      <main className="main-content">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <SwapInterface tokens={tokens} />
          </>
        )}
      </main>
    </div>
  )
}

export default App