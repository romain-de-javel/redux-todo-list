import React from 'react';
import { useState } from "react";
import Container from "@material-ui/core/Container";
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import '../assets/kanban.css'
import { addTodo, removeTodo, moveTodo, modTodo } from "../redux/kanbanSlice";

// add item includes
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

// dialog import
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';


function Kanban(){

    const dispatch = useDispatch<AppDispatch>();
    // add item
    const [todoTitle, setTodoTitle] = useState("");
    const [todoDescription, setTodoDescription] = useState("");
    const [todoId, setTodoId] = useState(0);
    const [colIdx, setColIdx] = useState(0);
    // check the lenght of the input description
    const checkLength = (todoDescription : string, e : any) => {
      if (todoDescription.length >= 200)
      {
        alert("Too many cgaratcters in your description")
        setTodoDescription(todoDescription.substring(0, 199));
      }
      else
        setTodoDescription(e.target.value);
    }

    // dialog 
    const [open, setOpen] = React.useState(false);
 
    const handleClose = () => {
        setOpen(false);
    };


    //----------------------------- begin of kanban--------------------------------/
    const kanban = useSelector((state: RootState) => state);

    // when we drop the selectionned task
    const onDragEnd = (result: DropResult, provided: ResponderProvided) => {

        if (result.destination === null || result.destination === undefined)
            return;
        else if (result.destination.index === result.source.index && result.destination.droppableId === result.source.droppableId)
            return;
        else {
            var sourceColIndex = kanban.kanban.columns.findIndex((e) => {return e.id ===  parseInt(result.source.droppableId)});
            var destinationColIndex = kanban.kanban.columns.findIndex((e) => {return e.id ===  parseInt(result.destination!.droppableId)});

            var sourceCol = kanban.kanban.columns[sourceColIndex];
            var destinationCol = kanban.kanban.columns[destinationColIndex];
            var srcTask = [...sourceCol.todos];
            var destTask = [...destinationCol.todos];
             
            if (sourceColIndex === destinationColIndex){
                let [removed] = srcTask.splice(result.source.index, 1);
                srcTask.splice(result.destination.index, 0, removed);
                dispatch(moveTodo({src: srcTask, dst: srcTask, sourceColIndex: sourceColIndex, destinationIndex:destinationColIndex}));
            }
            
            else{
                let [removed] = srcTask.splice(result.source.index, 1);
                destTask.splice(result.destination.index, 0, removed);

                dispatch(moveTodo({src: srcTask, dst: destTask, sourceColIndex: sourceColIndex, destinationIndex:destinationColIndex}));
            }
        }
    }
    
    // build the page
    return(
        // main container of all page
        <Container className="body" maxWidth="xl">
            <h1 style={{textAlign: "center", marginTop: "0", padding: "15px"}}>Kanban</h1>
            <Container maxWidth="xs">
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
            </Container>
            <div className="Dragdrop" style={{display: "flex", textAlign: "center", width: "100%", justifyContent: "space-around"}}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {kanban.kanban.columns.map((column, idx) => {
                        return (
                            <div className={"column"}>
                                <h3 className="column-name">{column.title}</h3>
                                <Droppable droppableId={column.id.toString()}>
                                    {(provided, snapshot) => {
                                        // draw the columns
                                        return (
                                            <div 
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}


                                                className={"drop-col"}
                                            >
                                                {column.todos.map((todo, index) => {
                                                    return (
                                                        
                                                        <Draggable key={todo.id} index={index} draggableId={todo.id.toString()} >
                                                            {(provided) => {
                                                                // draw items on each column
                                                                return(
                                                                    <div
                                                                        ref = {provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className="drag-el"
                                                                    >
                                                                        <div className="componenetsTodo"> 
                                                                            <h3>{todo.title}</h3>
                                                                            <h5>{todo.description}</h5>
                                                                        </div>
                                                                        <div className="buttons">
                                                                            <IconButton onClick={()=>{
                                                                                 setOpen(true);
                                                                                 setTodoId(index);
                                                                                 setColIdx(idx);
                                                                            }}>
                                                                                <EditIcon color="primary" />
                                                                            </IconButton>
                                                                            <IconButton style={{color:"red"}} onClick={() => {
                                                                            dispatch(removeTodo({id: todo.id, columnId: idx}))
                                                                                }}>
                                                                            <DeleteIcon />
                                                                            </IconButton>
                                                                        </div>
                                                                        
                                                                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                                                          <DialogTitle id="form-dialog-title">Edit Todo</DialogTitle>
                                                                          <DialogContent>
                                                                            <TextField
                                                                              autoFocus
                                                                              margin="dense"
                                                                              id="toto"
                                                                              label="Title"
                                                                              fullWidth
                                                                              onChange={(e) => setTodoTitle(e.target.value)}
                                                                              value={todoTitle}
                                                                            />
                                                                            <TextField
                                                                              autoFocus
                                                                              margin="dense"
                                                                              id="description"
                                                                              label="Description"
                                                                              onChange={(e) => checkLength(todoDescription, e)}
                                                                              value={todoDescription}
                                                                              fullWidth
                                                                            />
                                                                          </DialogContent>
                                                                          <DialogActions>
                                                                            <Button onClick={handleClose} color="primary">
                                                                              Cancel
                                                                            </Button>
                                                                            <Button onClick={() => {
                                                                                if (todoTitle.length === 0){
                                                                                    alert("empty title")
                                                                                    return;
                                                                                }
                                                                                dispatch(modTodo({title: todoTitle, description: todoDescription, id: todoId, columnId: colIdx}));
                                                                                handleClose();
                                                                                setTodoDescription("");
                                                                                setTodoTitle("");
                                                                            }} color="primary">
                                                                              Modify
                                                                            </Button>
                                                                          </DialogActions>
                                                                        </Dialog>
                                                                    </div>
                                                                )
                                                            }}
                                                        </Draggable>
                                                       // </div>
                                                    )
                                                })}
                                                {provided.placeholder} 
                                            </div> 
                                        )
                                    }}
                                </Droppable>
                            </div>
                        )
                    })}
                </DragDropContext>
            </div>
        </Container>
    
    )
}

export default Kanban;
