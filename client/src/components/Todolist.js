import { useState, useRef, useEffect } from "react";
import './Todolist.css';  
import axios from "axios";

const todoItems = [];

const Todolist = () => {

    const [input, setInput] = useState("");
    const [todoItems, setTodoItems] = useState([]);    


    useEffect(() => {
        axios.get('http://localhost:5000/todos')
            .then(response => {
                setTodoItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching todos:', error);
            });
    }, []);


    const handleClick = (e) => {
        e.preventDefault();
        // setTodoItems([...todoItems, input]);
        // setInput("");
        if (input.trim()) {
            axios.post('http://localhost:5000/todos', { todo: input })
                .then(response => {
                    setTodoItems([...todoItems, { id: response.data.id, todo: input }]);
                    setInput("");
                })
                .catch(error => {
                    console.error('Error adding todo:', error);
                });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleClick(e);
        }
    };

    const handleRemoveListItem = (id) => (e) => {
        e.preventDefault();
        // setTodoItems(todoItems.filter((_, i) => i !== index));
        e.preventDefault();
        axios.delete(`http://localhost:5000/todos/${id}`)
            .then(() => {
                setTodoItems(todoItems.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error('Error deleting todo:', error);
            });
    };
    return(

        <div className="todo-container" >
            <h2>Todo List</h2>
            <input 
                type="text" 
                className="todo-input"
                placeholder="type something..." 
                onKeyDown={handleKeyPress}
                onChange={(e) => setInput(e.target.value)} 
                value={input}
            />
                    


            <button 
                className="todo-button"
                type="Submit" 
                onClick={handleClick}>
                Add
            </button>

            <ul className="todo-list" >
                {todoItems.map((item, index) => {
                    return (
                        <>
                            <li key={item.id} className="todo-item">
                                {item.todo} 
                                <button className="remove-button" type="submit" onClick={handleRemoveListItem(item.id)}>X</button>
                            </li>
                            
                        </>
                        
                    )
                })}
            </ul>
        </div>
        
    )
};

export default Todolist;