import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./style.css";
import TodoForm from "./components/TodoForm";
import TaskList from "./components/TaskList";

type Task = { id: number; text: string; done: boolean };

export default function App() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const todoList = useMemo(() => tasks.filter((t) => !t.done), [tasks]);
  const doneList = useMemo(() => tasks.filter((t) => t.done), [tasks]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: Date.now(), text, done: false }]);
    setInput("");
  };

  const completeTask = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: true } : t))
    );

  const undoTask = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: false } : t))
    );

  const deleteTask = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">YONG TODO</h1>

      <TodoForm input={input} onChange={setInput} onSubmit={handleSubmit} />

      <div className="render-container">
        {/* App.tsx가 가진 데이터(todoList)와 핸들러(completeTask, deleteTask, undoTask)를 TaskList로 넘기지만, TaskList는 이를 다시 TaskItem에게 전달만 하게 됨 
            따라서 props-drilling 발생 */}
        <TaskList
          title="할 일"
          mode="todo"
          items={todoList} // data props-drilling (App.tsx → TaskList.tsx → TaskItem.tsx)
          onComplete={completeTask} // handler props-drilling (App.tsx → TaskList.tsx → TaskItem.tsx)
        />
        <TaskList
          title="완료"
          mode="done"
          items={doneList} // data props-drilling 발생 (App.tsx → TaskList.tsx → TaskItem.tsx)
          onUndo={undoTask} // handler props-drilling 발생 (App.tsx → TaskList.tsx → TaskItem.tsx)
          onDelete={deleteTask} // handler props-drilling 발생 (App.tsx → TaskList.tsx → TaskItem.tsx)
        />
      </div>
    </div>
  );
}
