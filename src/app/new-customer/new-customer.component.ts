import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3-service.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css'],
  animations: [
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-20px)' })
        ),
      ]),
    ]),
  ],
})
export class NewCustomerComponent implements OnInit {
  currentForm: string = 'details';

  firstName: string = '';
  lastname: string = '';
  mobile_no: string = '';
  fatherName: string = '';
  dob!: Date;
  gender: string = 'Gender';
  adhaar_no!: string;
  pan_no!: string;

  validAdhar!: boolean;

  aadhaarFile: File | null = null;
  panFile: File | null = null;

  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(private web3Service: Web3Service) {}

  ngOnInit(): void {
    this.validAdhar = false;
  }

  validateAdhaarImmediately() {
    if (this.adhaar_no && this.adhaar_no.length === 12) {
      this.validAdhar = VerhoeffAlgorithm.validateAadharNumber(this.adhaar_no);
    } else {
      this.validAdhar = false;
    }
  }

  submitDetails(detailsForm: any) {
    if (detailsForm.invalid) {
      Object.keys(detailsForm.controls).forEach((field) => {
        const control = detailsForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.currentForm = 'documents';
  }

  submitDocuments() {
    this.validAdhar = VerhoeffAlgorithm.validateAadharNumber(
      this.adhaar_no + ''
    );
    if (!this.validAdhar) return;

    if (!this.aadhaarFile || !this.panFile) {
      alert('Please upload both Aadhaar and PAN card images');
      return;
    }

    this.isSubmitting = true;
    this.showSuccessMessage = false;

    this.web3Service
      .setUserKyc(
        Number(this.adhaar_no),
        this.firstName,
        this.lastname,
        this.fatherName,
        String(this.dob),
        this.pan_no,
        Number(this.mobile_no),
        'no address'
      )
      .then(() => {
        return this.web3Service.getUserKyc(this.adhaar_no);
      })
      .then((res: any) => {
        this.isSubmitting = false;

        if (res) {
          this.firstName = res.fName;
          this.lastname = res.lname;
          this.dob = res.dob;
          this.pan_no = res.pan;
          this.mobile_no = res.contact;

          this.showSuccessMessage = true;

          setTimeout(() => {
            this.showSuccessMessage = false;
            this.change('preview');
          }, 2000);
        } else {
          console.error('No KYC data found for this Aadhaar number.');
        }
      })
      .catch((err) => {
        this.isSubmitting = false;
        console.error('Error during KYC transaction:', err);
      });
  }

  change(state: string) {
    if (state === 'documents' && !this.firstName.trim()) {
      return;
    }

    if (state === 'preview' && (!this.adhaar_no || !this.validAdhar)) {
      return;
    }

    this.currentForm = state;
  }

  onFileSelected(event: Event, fileType: 'aadhaar' | 'pan') {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        fileInput.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        fileInput.value = '';
        return;
      }

      if (fileType === 'aadhaar') {
        this.aadhaarFile = file;
      } else {
        this.panFile = file;
      }
    }
  }

  removeFile(fileType: 'aadhaar' | 'pan') {
    if (fileType === 'aadhaar') {
      this.aadhaarFile = null;
      const fileInput = document.getElementById('adhaar') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } else {
      this.panFile = null;
      const fileInput = document.getElementById('pancard') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  }
}

// Aadhaar Validator Class (Verhoeff Algorithm)
class VerhoeffAlgorithm {
  static d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  static p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  static inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

  static validateVerhoeff(num: string) {
    let c = 0;
    const myArray = VerhoeffAlgorithm.StringToReversedIntArray(num);
    for (let i = 0; i < myArray.length; i++) {
      c = VerhoeffAlgorithm.d[c][VerhoeffAlgorithm.p[i % 8][myArray[i]]];
    }
    return c === 0;
  }

  private static StringToReversedIntArray(num: string) {
    let myArray = [];
    for (let i = 0; i < num.length; i++) {
      myArray[i] = parseInt(num.substring(i, i + 1), 10);
    }
    return VerhoeffAlgorithm.Reverse(myArray);
  }

  private static Reverse(myArray: number[]) {
    return myArray.reverse();
  }

  public static validateAadharNumber(aadharNumber: string) {
    return VerhoeffAlgorithm.validateVerhoeff(aadharNumber);
  }
}
