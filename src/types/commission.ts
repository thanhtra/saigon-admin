export enum CommissionStatus {
    Pending = 'pending',
    Paid = 'paid',
    Cancelled = 'cancelled'
}

export interface Commission {
    id: string;
    amount: number;
    status: CommissionStatus;
    contractId?: string;
    saleId?: string;
    collaboratorId?: string;
}
