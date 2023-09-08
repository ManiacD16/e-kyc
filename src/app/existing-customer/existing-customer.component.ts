import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3-service.service';

@Component({
  selector: 'app-existing-customer',
  templateUrl: './existing-customer.component.html',
  styleUrls: ['./existing-customer.component.css']
})
export class ExistingCustomerComponent implements OnInit {

  data = false;
  searchAdhaar !: string;
  firstName = '';
  lastName = '';
  fatherName = '';
  gender = '';
  mobile_no = '';
  adhaar_no = '';
  pan_no = '';
  dob = '';

  constructor(private web3Service: Web3Service) { }

  ngOnInit(): void {
  }

  public searchCustomer() {
    this.web3Service.getUserKyc(this.searchAdhaar).then((res: any) => {
      this.firstName = res.fName;
      this.lastName = res.lname;
      this.fatherName = res.father;
      this.dob = res.dob;
      this.pan_no = res.pan;
      this.mobile_no = res.contact;
      this.data = true;
      // this.change('preview');
    })
  }

}
