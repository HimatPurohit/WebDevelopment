import React, { useState, useEffect } from "react";
import ToDoItem from "./ToDoItem";

function App() {
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);

  const fetchUrl = "https://api-1607.herokuapp.com/todolist";


  useEffect(()=>{
  fetch(fetchUrl)
      .then(response => response.json())
      .then(data =>setItems(data))
      .catch(err =>console.log("Error Reading data " + err));
  },[count]);



  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function removeItem(id) {
    // setItems(items.filter((item)=>item._id!==id));
    const requestOptions = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({ id : id})
  };
  fetch(fetchUrl,requestOptions)
        .then(response => response)
        .then(data => data.status===200?setCount(count-1):setCount(count))
        .catch(err => console.log("Error Reading data " + err));

  }

  function addItem() {
    if(inputText.trim()!==""){

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ todoItem : inputText.trim()})
    };
    fetch(fetchUrl,requestOptions)
          .then(response => response)
          .then(data => data.status===200?setCount(count+1):setCount(count))
          .catch(err => console.log("Error Reading data " + err));

      setInputText("");
    }
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input onChange={handleChange} type="text" value={inputText} />
        <button onClick={addItem}>
          <span>Add</span>
        </button>
      </div>
      <div>
        <ul>
          {items.map((todoItem) => (
            <ToDoItem key={todoItem._id} id={todoItem._id} onClick={removeItem} text={todoItem.todoItem} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
