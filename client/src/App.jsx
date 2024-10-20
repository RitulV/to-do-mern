import { useEffect, useState } from "react";
import ButtonAppBar from "./components/AppBar";
import TodoUi from "./components/TodoUi";
import AddTodo from "./components/AddTodo";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const [todos, setTodos] = useState({});

  useEffect(() => {
    fetch("https://mern-todo-api-livid.vercel.app/todos", {
      method: "GET",
    }).then((resp) => {
      resp.json().then((data) => {
        setTodos(data);
      });
    });
  }, []);

  return (
    <>
      <CssBaseline />
      <div>
        <ButtonAppBar />
        <TodoUi setTodos={setTodos} />
        <AddTodo todos={todos} setTodos={setTodos} />
      </div>
    </>
  );
}

export default App;
