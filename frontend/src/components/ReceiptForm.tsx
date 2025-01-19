import { useState } from "react";
import { Receipt, Item } from "../types";

interface Props {
  onSubmit: (receipt: Receipt) => void;
}

export default function ReceiptForm({ onSubmit }: Props) {
  const [receipt, setReceipt] = useState<Receipt>({
    retailer: "",
    purchaseDate: "",
    purchaseTime: "",
    items: [{ shortDescription: "", price: "" }],
    total: "",
  });

  const addItem = () => {
    setReceipt({
      ...receipt,
      items: [...receipt.items, { shortDescription: "", price: "" }],
    });
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const newItems = [...receipt.items];
    newItems[index] = { ...newItems[index], [field]: value } as Item;
    setReceipt({ ...receipt, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate total matches sum of items
    const itemsTotal = receipt.items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) || 0);
    }, 0);
    
    const total = parseFloat(receipt.total);
    if (Math.abs(itemsTotal - total) > 0.01) {
      alert("Total must match the sum of item prices");
      return;
    }
    
    onSubmit(receipt);
  };

  return (
    <form onSubmit={handleSubmit} className="receipt-form">
      <div>
        <label>Retailer:</label>
        <input
          placeholder="Retailer Name"
          type="text"
          value={receipt.retailer}
          onChange={(e) => setReceipt({ ...receipt, retailer: e.target.value })}
          pattern="^[\w\s\-&]+$"
          title="Only letters, numbers, spaces, hyphens, and & are allowed"
          required
        />
      </div>

      <div>
        <label>Purchase Date:</label>
        <input
          placeholder="YYYY-MM-DD"
          type="date"
          value={receipt.purchaseDate}
          onChange={(e) => setReceipt({ ...receipt, purchaseDate: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Purchase Time:</label>
        <input
          placeholder="HH:MM"
          type="time"
          value={receipt.purchaseTime}
          onChange={(e) => setReceipt({ ...receipt, purchaseTime: e.target.value })}
          required
        />
      </div>

      {receipt.items.map((item, index) => (
        <div key={index} className="item-inputs">
          <input
            type="text"
            placeholder="Description"
            value={item.shortDescription}
            onChange={(e) => updateItem(index, "shortDescription", e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Price (0.00)"
            value={item.price}
            onChange={(e) => updateItem(index, "price", e.target.value)}
            pattern="^\d+\.\d{2}$"
            required
          />
        </div>
      ))}

      <button type="button" onClick={addItem}>
        Add Item
      </button>

      <div>
        <label>Total:</label>
        <input
          placeholder="0.00"
          type="text"
          value={receipt.total}
          onChange={(e) => setReceipt({ ...receipt, total: e.target.value })}
          pattern="^\d+\.\d{2}$"
          required
        />
      </div>

      <button type="submit">Submit Receipt</button>
    </form>
  );
}
