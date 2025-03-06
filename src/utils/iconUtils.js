// Utility function to get token icon path
export const getTokenIconPath = (tokenSymbol) => {
    try {
      // Return the path to the token icon
      return `/token-icons/${tokenSymbol.toLowerCase()}.svg`
    } catch (error) {
      // Return a fallback icon if the token icon is not found
      return "/token-icons/default.svg"
    }
  }
  
  // Utility function to handle image loading errors
  export const handleImageError = (event) => {
    event.target.src = "/token-icons/default.svg"
  }
  
  