import { useTodo } from "../contexts/TodoContext";
import TaskItem from "./TaskItem";

export default function TodoList() {
  const { todoList } = useTodo();
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">할 일</h2>
      <ul className="render-container__list">
        {todoList.map((t) => (
          <TaskItem key={t.id} task={t} />
        ))}
      </ul>
    </div>
  );
}
