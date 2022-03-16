
import React, { Component } from "react";
import Mem from "./contracts/nft.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

var val,va;
class App extends Component {
  state = { hash:'',buffer:null,web3:false,owner:" ",account:"address of account."};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();
      this.setState({account:this.accounts[0]});
      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = Mem.networks[this.networkId];
      this.contract= new this.web3.eth.Contract(
        Mem.abi,
        this.deployedNetwork && this.deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({web3:true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  run=async (event) => {
   event.preventDefault()

  const file=event.target.files[0];
  const reader =new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onloadend=()=>{
  this.setState({buffer:Buffer(reader.result)})}
    
  }

    descr=async (e)=>{
    val=e.target.value;
 }

    done= async (event)=>{ event.preventDefault()

   console.log("Submitting file to ipfs...")

   const result=  await ipfs.add(this.state.buffer)
  
   await this.contract.methods.hashe(result[0].hash,val).send({ from: this.accounts[0],gasPrice: '20000000000' })
   this.setState({ hash: result[0].hash})
       
   var ig=   await this.contract.methods.givehash(val).call({ from: this.accounts[0]})
   var ow=   await this.contract.methods.Giveowner(val).call({ from: this.accounts[0]})
   
   this.setState({hash:ig})
   this.setState({owner:ow})
    }



    buy=async()=>{
   
     this.accounts = await this.web3.eth.getAccounts();
     this.setState({account:this.accounts[0]});
     await this.contract.methods.pay(val).send({ from: this.accounts[0],value:this.web3.utils.toWei('1', 'ether'),gasPrice: '20000000000' })

      
     var ow=   await this.contract.methods.Giveowner(val).call({ from: this.accounts[0]})
     this.setState({owner:ow})}

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
    
 <div className="App">
      <nav className="nav">
        <h1>NFT MARKETPLACE</h1>
        <p> Your account : {this.state.account}</p>
      </nav>
      <h2>Mint NFT</h2>
       
    <form onSubmit={this.done} className >
       <input type='file'  accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.run} />
       <p> &nbsp;</p>
       <p> &nbsp;</p>
       <input type="number"   onChange={this.descr} placeholder="Token Id" />
       <input type="submit" />Upload!
       <p> &nbsp;</p>
       <p> &nbsp;</p>
      <ul>
   
        <li><img src={`https://ipfs.infura.io/ipfs/${this.state.hash}`} style={{ maxWidth: '220px',height:'300px'}}/> </li>
        <li><h2>NFT owner is : {this.state.owner}</h2></li>
   
  
      </ul>
  
    
    </form>
    <div className="buy">
  
      <button onClick={this.buy}>BUY!!!</button>
    </div>

 </div>
    );
  }
}

export default App;
