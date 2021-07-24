import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);
  const fetchUrl = "https://api-1607.herokuapp.com/keeper";

  useEffect(()=>{
    fetch(fetchUrl)
        .then(response => response.json())
        .then(data =>setNotes(data))
        .catch(err =>console.log("Error Reading data " + err));
    },[count]);

  function addNote(newNote) {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ title : newNote.title.trim(), content: newNote.content.trim()})
    };
    fetch(fetchUrl,requestOptions)
          .then(() => setCount(count+1))
          .catch(err => console.log("Error Reading data " + err));

  }

  function deleteNote(id) {
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

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map(noteItem => {
        return (
          <Note
            key={noteItem._id}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
