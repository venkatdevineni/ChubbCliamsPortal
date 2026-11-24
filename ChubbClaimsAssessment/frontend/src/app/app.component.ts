import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimsService } from './claims.service';
import { Claim, CreateClaimRequest } from './claim.model';

@Component({ selector: 'app-root', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './app.component.html', styleUrl: './app.component.css' })
export class AppComponent implements OnInit {
  claims: Claim[] = []; selected?: Claim; role: 'claimant' | 'staff' = 'staff'; loading = true; error = ''; notice = '';
  filter = 'All'; search = ''; showForm = false;
  form: CreateClaimRequest = { claimant: '', type: 'Motor', incident: 'Accident', location: '', estimatedLoss: 0, description: '' };
  statuses = ['Submitted', 'Under Review', 'Awaiting Documents', 'Approved', 'Rejected'];
  constructor(private api: ClaimsService) {}
  ngOnInit(): void { this.refresh(); }
  refresh(): void { this.loading = true; this.api.list().subscribe({ next: data => { this.claims = data; this.loading = false; if (this.selected) this.selected = this.claims.find(c => c.id === this.selected?.id); }, error: () => { this.loading = false; this.error = 'Cannot reach the mock API. Start the backend and retry.'; } }); }
  get visible(): Claim[] { return this.claims.filter(c => (this.filter === 'All' || c.status === this.filter) && (`${c.id} ${c.claimant} ${c.type} ${c.location}`.toLowerCase().includes(this.search.toLowerCase()))); }
  get totalExposure(): number { return this.claims.filter(c => !['Approved', 'Rejected'].includes(c.status)).reduce((sum, c) => sum + c.estimatedLoss, 0); }
  get activeCount(): number { return this.claims.filter(c => !['Approved', 'Rejected'].includes(c.status)).length; }
  get waitingCount(): number { return this.claims.filter(c => c.status === 'Awaiting Documents').length; }
  choose(claim: Claim): void { this.selected = claim; this.notice = ''; }
  setStatus(status: string): void { if (!this.selected) return; this.api.updateStatus(this.selected.id, status, `Updated by staff to ${status}.`, 'Officer: Daniel Wong').subscribe({ next: updated => { this.selected = updated; this.notice = `Claim ${updated.id} updated to ${status}`; this.refresh(); }, error: () => this.error = 'Unable to update claim status.' }); }
  submitClaim(): void { this.api.create(this.form).subscribe({ next: claim => { this.notice = `Claim submitted successfully. Your reference is ${claim.id}.`; this.showForm = false; this.form = { claimant: '', type: 'Motor', incident: 'Accident', location: '', estimatedLoss: 0, description: '' }; this.refresh(); this.selected = claim; }, error: () => this.error = 'Claim submission failed. Check the API connection.' }); }
  money(value: number): string { return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(value); }
  statusClass(status: string): string { return status.toLowerCase().replaceAll(' ', '-'); }
}
