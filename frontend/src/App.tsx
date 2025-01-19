import { useState } from "react"
import ReceiptForm from "./components/ReceiptForm"
import { Receipt } from "./types"
import { submitReceipt, getPoints } from "./api"
import "./App.css"

export default function App() {
  const [points, setPoints] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (receipt: Receipt) => {
    try {
      setError(null)
      const { id } = await submitReceipt(receipt)
      const { points } = await getPoints(id)
      setPoints(points)
    } catch (err) {
      setError("Failed to process receipt. Please try again.")
      console.error(err)
    }
  }

  return (
    <div className="app">
      <h1>Receipt Processor</h1>
      <ReceiptForm onSubmit={handleSubmit} />
      {error && <div className="error">{error}</div>}
      {points !== null && (
        <div className="points">
          <h2>Points Earned</h2>
          <p>{points} points</p>
        </div>
      )}
    </div>
  )
}
