export type CommissionStatus = "due" | "paid";

export interface Commission {
  id: number;
  sales_agent_id: number;
  amount: string;
  commission_status: CommissionStatus;
}

export interface INewCommission {
  sales_agent_id: number;
  amount: string;
  commission_status: "due" | "paid";
}
