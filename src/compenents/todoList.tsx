// React App
import React from "react";
import { useState } from "react";
// Material-UI Imports
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
// Other Imports
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addTodo, removeTodo, setTodoStatus } from "../redux/todoSlice";

function TodoList() {
  // DONE
  var maxLength = 10;
  
  //React Hooks
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
      // check the lenght of the input description
  const checkLength = (todoDescription : string, e : any) => {
    if (todoDescription.length >= maxLength)
    {
      alert("Too many cgaratcters in your description")
      setTodoDescription("");
    }
    else
      setTodoDescription(e.target.value);
  }
    //React Redux Hooks
  const todoList = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();

  //Rendering
  return (
    <Container className="container" maxWidth="xs">
    <Typography style={{ textAlign: "center", marginBottom: "20px"  }} variant="h3">
      Redux List App
    </Typography>
    <TextField
      style ={{marginBottom: "20px"}}
      variant="filled"
      label="To Do Item Title"
      fullWidth
      onChange={(e) => setTodoTitle(e.target.value)}
      value={todoTitle}
    />
     <TextField
      style ={{marginBottom: "20px"}}
      variant="filled"
      label="To Do Item Description"
      fullWidth
      onChange={(e) => checkLength(todoDescription, e)}
      value={todoDescription}
    />
    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={() => {
        if (todoTitle.length === 0){
            alert("empty title")
            return;
        }
        dispatch(addTodo(todoTitle, todoDescription));
        setTodoDescription("");
        setTodoTitle("");
      }}
    >
     Add Item
    </Button>
    <List>
      {todoList.todos.map((todo) => (
        <ListItem key={todo.id}>
          <ListItemText
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.title}
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => {
                dispatch(removeTodo(todo.id));
              }}
            >
              <DeleteIcon />
            </IconButton>
            <Checkbox
              edge="end"
              value={todo.completed}
              onChange={() => {
                dispatch(
                  setTodoStatus({ completed: !todo.completed, id: todo.id })
                );
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  </Container>
  );
}

export default TodoList;