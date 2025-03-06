"use client"

import { useState, useRef, useEffect } from "react"
import "./TokenSelector.css"
import { getTokenIconPath } from "../utils/iconUtils"

const TokenSelector = ({ selectedToken, tokens, onSelectToken }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleSelectToken = (token) => {
    onSelectToken(token)
    setIsOpen(false)
  }

  return (
    <div className="token-selector" ref={dropdownRef}>
      <button className="token-selector-button" onClick={toggleDropdown}>
        {selectedToken ? (
          <>
            <div className="token-icon-name">
              <img
                src={getTokenIconPath(selectedToken.name) || "/placeholder.svg"}
                alt={selectedToken.name}
                className="token-icon"
                // onError={handleImageError}
              />
              <span className="token-name">{selectedToken.name}</span>
            </div>
            <span className="dropdown-arrow">▼</span>
          </>
        ) : (
          "Select Token"
        )}
      </button>

      {isOpen && (
        <div className="token-dropdown">
          {tokens.map((token) => (
            <div
              key={token.name}
              className={`token-item ${selectedToken?.name === token.name ? "selected" : ""}`}
              onClick={() => handleSelectToken(token)}
            >
              <div className="token-info">
                <div className="token-icon-name">
                  <img
                    src={getTokenIconPath(token.name) || "/placeholder.svg"}
                    alt={token.name}
                    className="token-icon"
                    // onError={handleImageError}
                  />
                  <span className="token-item-name">{token.name}</span>
                </div>
                <span className="token-balance">
                  {Number.parseFloat(token.available.amount.number).toLocaleString()} {token.available.amount.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TokenSelector

