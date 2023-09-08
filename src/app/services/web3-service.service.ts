import { Injectable } from '@angular/core';
import Web3 from 'web3';

const contractAddress = "0xD031Eb1C676F6FC466C0937dFDc33251DAaA87db";
const ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "aadhar",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_fName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_lName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_father",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_dob",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_pan",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_contact",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_adrs",
				"type": "string"
			}
		],
		"name": "setter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "data",
		"outputs": [
			{
				"internalType": "string",
				"name": "fName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "lname",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "father",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dob",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "pan",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "contact",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "adrs",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

declare const window: any;


@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  window: any;

  constructor() { }
  private getAccounts = async () => {
    try {
      return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
      return [];
    }
  }

  public getClient = async () => {
    try {
      const contract = new window.web3.eth.Contract(
        ABI,
        contractAddress,
      );
      const token = await contract.methods.getClient().call();
      console.log("token", token)
      return token

    }
    catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage)

    }
  }

  public setUserKyc = async (adhaar_no: number,firstName: string,lastname: string,fatherName: string,dob: string,pan_no: string,mobile_no: number,addss: string) => {
    try {
      const contract = new window.web3.eth.Contract(
        ABI,
        contractAddress,
      );
      const token = await contract.methods.setter(adhaar_no, firstName, lastname, fatherName, dob, pan_no, mobile_no, addss)
      .send({from: String(window.web3.eth.defaultAccount)})
      .on('transactionHash', function (hash: any) {
          console.log(hash);
       })
        .on('receipt', function (receipt: any) {
          console.log(receipt);
        })
        .on('confirmation', function (confirmationNumber: any, receipt: any) {
          console.log(confirmationNumber, receipt);
        })
        .on('error', function (error: any, receipt: any) {
              console.error(error);
        });

      console.log("token", token)
      return token
    }
    catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage)

    }
  }

  
  public getUserKyc = async (adhaar_no: any) => {
    try {
      const contract = new window.web3.eth.Contract(
        ABI,
        contractAddress,
      );
      const token = await contract.methods.data(String(adhaar_no)).call();
      console.log("token", token)
      return token

    }
    catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage)

    }
  }


  public setClient = async () => {
    try {
      const contract = new window.web3.eth.Contract(
        ABI,
        contractAddress,
      );
      const token = await contract.methods.setClient('ayushman').send({from: String(window.web3.eth.defaultAccount)})
      .on('transactionHash', function (hash: any) {
          console.log(hash);
       })
        .on('receipt', function (receipt: any) {
          console.log(receipt);
        })
        .on('confirmation', function (confirmationNumber: any, receipt: any) {
          console.log(confirmationNumber, receipt);
        })
        .on('error', function (error: any, receipt: any) {
              console.error(error);
        });

      console.log("token", token)
      return token
    }
    catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage)

    }
  }

  public openMetamask = async () => {
    window.web3 = new Web3(window.ethereum);
    let addresses = await this.getAccounts();
    console.log("service", addresses)
    window.web3.eth.defaultAccount = addresses[0];
    if (!addresses.length) {
      try {
        addresses = await window.ethereum.enable();
      } catch (e) {
        return false;
      }
    }
    return addresses.length ? addresses[0] : null;
  };
}
