export interface Item {
  shortDescription: string;
  price: string;
}

export interface Receipt {
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items: Item[];
  total: string;
}

export interface ReceiptResponse {
  id: string;
}

export interface PointsResponse {
  points: number;
}
