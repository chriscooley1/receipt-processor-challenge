import { Receipt, ReceiptResponse, PointsResponse } from "./types";

const API_BASE_URL = "http://localhost:8000";

export const submitReceipt = async (receipt: Receipt): Promise<ReceiptResponse> => {
  const response = await fetch(`${API_BASE_URL}/receipts/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(receipt),
  });

  if (!response.ok) {
    throw new Error("Failed to submit receipt");
  }

  return response.json();
};

export const getPoints = async (id: string): Promise<PointsResponse> => {
  const response = await fetch(`${API_BASE_URL}/receipts/${id}/points`);

  if (!response.ok) {
    throw new Error("Failed to get points");
  }

  return response.json();
};
