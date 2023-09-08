// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

contract userInfo{
    struct userDetails{
        // uint aadharNumber;
        string fName;
        string lname;
        string father;
        string dob;
        string pan;
        uint contact;
        string adrs;
         
    }

    mapping(uint=>userDetails) public data;

    function setter(uint aadhar,string memory _fName,string memory _lName,string memory _father,string memory _dob,string memory _pan,uint _contact,string memory _adrs) public{
        // require(aadharNumber==0,"already registerd");
        data[aadhar]=userDetails(_fName,_lName,_father,_dob,_pan,_contact,_adrs);
    }

}