import { Component, OnInit } from '@angular/core';
import { Web3Service } from './services/web3-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'KYC_DApp';

  constructor(private web3Service: Web3Service) {}

  ngOnInit(): void {

    this.web3Service.openMetamask();
  }
}
