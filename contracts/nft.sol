// SPDX-License-Identifier: MIT

//Compiler version patch.major.minor
pragma solidity ^0.8.0;

import "./ERC721.sol";

contract nft is ERC721("nft","drgn"){
     //Data variable initialize
    uint public id;
    uint public amount=0;
  
    struct val{
       address holder;
       string hash;
                     }
    mapping(uint256=>val) public own;
    mapping(uint256=>address) royal;
    
    
     //Store the hash generated by IPFS and link it with the token ID.
    
    function hashe(string memory _hash,uint256 _id) public{
    
    own[_id].hash=_hash;
    _mint(msg.sender,_id);
    royal[_id]= msg.sender;
    own[_id].holder=msg.sender;

    }

   //Allow other account to purchase the NFT with a standard price of 1 ether and transfer the ownership.
   //Also give the royality of 10%
    
    function pay(uint _id) public payable{

        require(msg.value>=1 ether,"Not paid");

    
       //Royalty
        if(royal[_id]!=own[_id].holder){
                
                amount=uint((10*address(this).balance)/100);
                payable(royal[_id]).transfer((amount));

        }
        payable(own[_id].holder).transfer((address(this).balance-amount));
       
       _transfer(own[_id].holder,msg.sender,_id);
       
       require(ownerOf(_id)!=own[_id].holder,"Unable to transfer the ownership");
    
       own[_id].holder=msg.sender;
       
    }

       //Give the NFT Owner address.
    
    function Giveowner(uint256 _i) public view returns (address){
            
            return own[_i].holder;
       }


    //Give the hash of NFT.
    
    function givehash(uint256 _i) public view returns (string memory){
      
         return own[_i].hash;
      }





}