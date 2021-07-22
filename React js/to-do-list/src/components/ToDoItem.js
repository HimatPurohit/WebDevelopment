import React from "react";

function ToDoItem(props){
    return (
        <div onClick={()=>props.onClick(props.id)}>
        <li>{props.text}</li>
        <hr/>
        </div>
    );
}

export default ToDoItem;