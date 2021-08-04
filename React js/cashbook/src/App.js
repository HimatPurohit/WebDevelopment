import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import './App.css';

function Model(props){
  const[note,setNote]=useState("");
  const[amount,setAmount]=useState(0);
  const[disabled,setDisabled]=useState(true);
  
  function handleChange(e){
    if(e.target.name==="note"){
      setNote(e.target.value);
    }else{
      setAmount(parseFloat(e.target.value));
    }
  }
  useEffect(()=>{
    if(isNaN(amount) || note===""){
      setDisabled(true);
    }else{
      setDisabled(false);
    }
  })

return (<div className="model">
<div className="model-content">
<p>New Entry</p>
<button className="close-btn" onClick={()=>props.onClick()}>Close</button>
<input data-testid="note" type="number" name="amount" min={0} placeholder="&#x20B9; 0.00"
value={amount} onChange={(e)=>handleChange(e)} required />
<textarea data-testid="amount" name="note" placeholder="Entry Note"
value={note} onChange={(e)=>handleChange(e)} required/>
<button data-testid="create-entry-btn" className={props.btn===1?"green-btn":"red-btn"}
onClick={()=>props.onAdd(props.btn,note,amount)} disabled={disabled}>{props.btn===1?"IN":"OUT"}</button>
</div>
</div>);
}


function EntryList(props){

  return (
        <div className="transaction">
      <div className="entry">
        <Moment>{props.time}</Moment>
        <h1>{props.note}</h1>
        </div>
        <div className="entry out">
        <h1>OUT</h1>
        <h1>&#x20B9; {props.type===0?props.amount:"0"}</h1>
        </div>
        <div className="entry in">
        <h1>IN</h1>
        <h1>&#x20B9; {props.type===1?props.amount:"0"}</h1>
        </div>
      </div>
  );
}

function App() {
  const [balance,setBalance]=useState(0);
  const [entry,setEntry]=useState([]);
  const [btn,setBtn]=useState(null);

  async function createEntry(type,note,amount){
    setBtn(type);
    if(type===1){
      await setBalance(balance+amount);
    }else{
      await setBalance(balance-amount);
    }
    await setEntry([...entry,{time:Date(), type:type,note:note, amount:amount}]);
    handleCloseClick();
  }

  function handleCloseClick(){
    setBtn(null);
  }

  return (
    <div className="App">
    <h1 style={{textAlign:"center"}}>My Cashbook</h1>  
      <div className="today-balance">
      <h1 data-testid="balance">{balance} &#x20B9;</h1>
      <p>Todays Balance</p>
      </div>
      <div style={{backgroundColor:"#9c9c9c",textAlign:"center",padding:"32px"}}>
      {entry.length===0?"No Entry Found!":
      entry.map(detail=><EntryList type={detail.type} time={detail.time} note={detail.note} amount={detail.amount} />)}
      </div>

      {btn!==null && <Model btn={btn} onClick={handleCloseClick} onAdd={createEntry}/>}

      <div className="action-group">
      <button className="red" data-testid="cashout-btn" onClick={()=>{
        setBtn(0);}}>Out</button>
      <button className="green" data-testid="cashin-btn" onClick={()=>{
        setBtn(1);}}>IN</button>
      </div>
    </div>
  );
}


export default App;
