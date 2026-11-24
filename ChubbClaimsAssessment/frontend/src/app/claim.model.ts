export interface Claim {
  id: string; claimant: string; type: string; incident: string; location: string;
  date: string; status: string; estimatedLoss: number; description: string;
  update: string; officer: string;
}
export interface CreateClaimRequest { claimant: string; type: string; incident: string; location: string; estimatedLoss: number; description: string; }
