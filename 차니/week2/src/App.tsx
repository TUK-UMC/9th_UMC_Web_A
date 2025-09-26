import { useMemo, useState } from "react";
import "../style.css";

type Task = { id: number; text: string; done: boolean };

export default function App() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const todoList = useMemo(() => tasks.filter((t) => !t.done), [tasks]);
  const doneList = useMemo(() => tasks.filter((t) => t.done), [tasks]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: Date.now(), text, done: false }]);
    setInput("");
  };

  const completeTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: true } : t))
    );
  };

  const undoTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: false } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">YONG TODO</h1>

      <form
        id="todo-form"
        className="todo-container__form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          id="todo-input"
          className="todo-container__input"
          placeholder="할 일 입력"
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="todo-container__button">
          할 일 추가
        </button>
      </form>

      <div className="render-container">
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul id="todo-list" className="render-container__list">
            {todoList.map(({ id, text }) => (
              <li key={id} className="render-container__item">
                <span className="render-container__item-text">{text}</span>
                <button
                  className="render-container__item-button"
                  style={{ backgroundColor: "#28a745" }}
                  onClick={() => completeTask(id)}
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul id="done-list" className="render-container__list">
            {doneList.map(({ id, text }) => (
              <li key={id} className="render-container__item">
                <span className="render-container__item-text">{text}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="render-container__item-button"
                    style={{ backgroundColor: "#28a745" }}
                    onClick={() => undoTask(id)}
                  >
                    되돌리기
                  </button>
                  <button
                    className="render-container__item-button"
                    onClick={() => deleteTask(id)}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
