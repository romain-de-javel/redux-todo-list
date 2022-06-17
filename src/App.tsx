import React from "react";
import TodoList from "./compenents/todoList"
import Kanban from "./compenents/kanban"
import {Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
     
     //Rendering
     return (
      <Router>
        <Routes>
              <Route path="/" element={<TodoList/>} />
              <Route path="/tasks" element={<Kanban />} />
        </Routes>
    </Router>
     );
}

export default App;