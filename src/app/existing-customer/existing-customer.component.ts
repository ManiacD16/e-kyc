import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3-service.service';

@Component({
  selector: 'app-existing-customer',
  templateUrl: './existing-customer.component.html',
  styleUrls: ['./existing-customer.component.css'],
})
export class ExistingCustomerComponent implements OnInit {
  data = false;
  searchAdhaar!: string;
  firstName = '';
  lastName = '';
  fatherName = '';
  gender = '';
  mobile_no = '';
  adhaar_no = '';
  pan_no = '';
  dob = '';

  // Additional properties for enhanced UX
  isSearching = false;
  searchAttempted = false;
  isValidAadhaar = false;

  constructor(private web3Service: Web3Service) {}

  ngOnInit(): void {}

  public searchCustomer() {
    // Validate Aadhaar number format
    if (
      !this.searchAdhaar ||
      this.searchAdhaar.length !== 12 ||
      !/^\d+$/.test(this.searchAdhaar)
    ) {
      this.isValidAadhaar = false;
      this.searchAttempted = true;
      return;
    }

    this.isValidAadhaar = true;
    this.searchAttempted = true;
    this.isSearching = true;
    this.data = false;

    // Simulate network delay for better UX
    setTimeout(() => {
      this.web3Service
        .getUserKyc(this.searchAdhaar)
        .then((res: any) => {
          this.isSearching = false;

          if (res) {
            this.firstName = res.fName;
            this.lastName = res.lname;
            this.fatherName = res.father;
            this.dob = res.dob;
            this.pan_no = res.pan;
            this.mobile_no = res.contact;
            this.adhaar_no = this.searchAdhaar; // Store for display
            this.data = true;
          } else {
            console.error('No KYC data found for this Aadhaar number.');
            this.data = false;
          }
        })
        .catch((err) => {
          console.error('Error fetching user KYC:', err);
          this.isSearching = false;
          this.data = false;
        });
    }, 1000); // 1 second delay for loading animation
  }

  // Reset search form
  resetSearch() {
    this.searchAdhaar = '';
    this.searchAttempted = false;
    this.isValidAadhaar = false;
    this.data = false;
  }

  // Format Aadhaar number for display (XXXX-XXXX-XXXX)
  formatAadhaar(aadhaar: string): string {
    if (!aadhaar) return '';
    return aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  // Format phone number for display
  formatPhone(phone: string): string {
    if (!phone) return '';

    // For a 10-digit number
    if (phone.length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '+91 $1-$2-$3');
    }

    return phone;
  }
}
