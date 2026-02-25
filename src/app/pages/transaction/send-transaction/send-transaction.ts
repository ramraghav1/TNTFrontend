import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { StepsModule } from 'primeng/steps';
import { Fluid } from "primeng/fluid";
import { SelectModule } from 'primeng/select';  
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
interface PersonInfo {
  name: string;
  address: string;
  mobile: string;
  showOther: boolean;
  state?: string;
  district?: string;
  localLevel?: string;
  wardNo?: string;
  idType?: string;
  idNumber?: string;
  issueDate?: string;
  expiryDate?: string;
}

@Component({
  selector: 'app-send-transaction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    StepsModule,
    Fluid,
    SelectModule
  ],
  templateUrl: './send-transaction.html',
  styleUrls: ['./send-transaction.scss']
})

export class SendTransaction {
  constructor(private http: HttpClient) {}
  step = 1;

  paymentType: string = '';
  payoutLocation: string = '';

  paymentTypes = [
    { name: 'Bank Transfer', value: 'bank' },
    { name: 'Mobile Wallet', value: 'wallet' },
    { name: 'Cash Payment', value: 'cash' }
  ];
  
  bankLocations = [
    { name: 'Nabil Bank', value: 'nabil' },
    { name: 'Global IME Bank', value: 'globalime' },
    { name: 'NIC Asia Bank', value: 'nic' }
  ];
  
  walletLocations = [
    { name: 'eSewa', value: 'esewa' },
    { name: 'Khalti', value: 'khalti' },
    { name: 'IME Pay', value: 'imepay' }
  ];
  cashLocations = [
    { name: 'Anywhere in Nepal', value: 'anywhere' },
  ];
  transaction = {
    paymentType: null as string | null,
    payoutLocation: null as string | null,
    collectedAmount: null as number | null,
    serviceFee: null as number | null,
    transferAmount: null as number | null
  };

  sender: PersonInfo = {
    name: '',
    address: '',
    mobile: '',
    showOther: false
  };

  receiver: PersonInfo = {
    name: '',
    address: '',
    mobile: '',
    showOther: false
  };

  showConfirm = false;

  next() {
    if (this.step < 4) this.step++;
  }

  prev() {
    if (this.step > 1) this.step--;
  }
  showReceipt = false;
  confirm() {
    //this.showConfirm = true;
    this.showConfirm = false;
    this.showReceipt = true;
    const payload = {
      paymentType: this.transaction.paymentType,
      payoutLocation: this.transaction.payoutLocation,
      collectedAmount: this.transaction.collectedAmount,
      serviceFee: this.transaction.serviceFee,
      transferAmount: this.transaction.transferAmount,
      senderName: this.sender.name,
      senderAddress: this.sender.address,
      senderMobile: this.sender.mobile,
      receiverName: this.receiver.name,
      receiverAddress: this.receiver.address,
      receiverMobile: this.receiver.mobile
    };
  
    this.http.post(`${environment.apiBaseUrl}/Transaction/create`, payload)
      .subscribe({
        next: (res) => {
          console.log('Transaction created successfully:', res);
          this.showConfirm = false;
          this.showReceipt = true;
        },
        error: (err) => {
          console.error('Error creating transaction:', err);
          alert('Failed to create transaction. Please try again.');
        }
      });
  }

  closeConfirm() {
    this.showConfirm = false;
 
  }
  onPaymentTypeChange(type: string) {
    if (type === 'cash') {
      this.transaction.payoutLocation = 'anywhere';
    } else {
      this.transaction.payoutLocation = '';
    }
  }
  getPaymentTypeName(): string {
    const found = this.paymentTypes.find(pt => pt.value === this.transaction.paymentType);
    return found ? found.name : '-';
  }
  getPayoutLocationName(): string {
    if (this.transaction.paymentType === 'bank') {
      return this.bankLocations.find(l => l.value === this.transaction.payoutLocation)?.name || '-';
    }
    if (this.transaction.paymentType === 'wallet') {
      return this.walletLocations.find(l => l.value === this.transaction.payoutLocation)?.name || '-';
    }
    if (this.transaction.paymentType === 'cash') {
      return this.cashLocations[0]?.name || '-';
    }
    return '-';
  }
  printReceipt() {
    setTimeout(() => window.print(), 100);
  }
  
  closeReceipt() {
    this.showReceipt = false;
  }
  onAmountChange() {
    const transfer = Number(this.transaction.transferAmount) || 0;
    const fee = Number(this.transaction.serviceFee) || 0;
    this.transaction.collectedAmount = transfer + fee;
    console.log('Calculated total:', this.transaction.collectedAmount);
  }
  
  
}