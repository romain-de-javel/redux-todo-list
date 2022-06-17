import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo, Column, Kanban } from "../models/Todo";

const initialState = {
  id: Date.now(),
  columns: [{
    id: 0,
    title: "TODO",
    todos: [{
      id: Date.now(),
      title: "first task",
      description: "first task description"
    } as Todo]
  } as Column, {
    id: 1,
    title: "IN PROGRESS",
    todos: [{
      id: Date.now() - 2,
      title: "second task",
      description: "second task description"
    } as Todo]
  } as Column, {
    id: 2,
    title: "DONE",
    todos: [{
      id: Date.now() - 3,
      title: "Third task",
      description: "third task description"
    } as Todo]
  } as Column ]
} as Kanban;

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.columns[0].todos.push(action.payload);
      },
      prepare: (title: string, description: string) => ({
        payload: {
          id: Date.now(),
          title,
          description,
          completed: false,
        } as Todo,
      }),
    },
    modTodo(state, action: PayloadAction<{title: string, description: string, id: number, columnId: number}>
        ){
          if (action.payload.title !== "")
            state.columns[action.payload.columnId].todos[action.payload.id].title = action.payload.title;
          if (action.payload.description !== "")
            state.columns[action.payload.columnId].todos[action.payload.id].description = action.payload.description;
    },
    moveTodo(state, action: PayloadAction<{src: Todo[], dst: Todo[], sourceColIndex: number, destinationIndex: number}>){
      state.columns[action.payload.sourceColIndex].todos = action.payload.src;
      if (action.payload.sourceColIndex !== action.payload.destinationIndex){
        state.columns[action.payload.destinationIndex].todos = action.payload.dst;   
      }
    },
    removeTodo(state, action: PayloadAction<{id: number, columnId: number}>) {

      state.columns[action.payload.columnId].todos = state.columns[action.payload.columnId].todos.filter((element) => {
        return element.id !== action.payload.id;
      })
    },
    setTodoStatus(
      state,
      action: PayloadAction<{ completed: boolean; id: number, columnId: number }>
    ) {
      state.columns[action.payload.columnId].todos[action.payload.id].completed = action.payload.completed;
    },
  },
});

export const { addTodo, removeTodo, moveTodo, setTodoStatus, modTodo } = kanbanSlice.actions;
export default kanbanSlice.reducer;