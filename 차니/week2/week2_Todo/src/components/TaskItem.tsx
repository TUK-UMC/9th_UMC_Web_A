import { useTodo } from "../hooks/useTodo";
import type { Task } from "../types/Todo";

export default function TaskItem({ task }: { task: Task }) {
  const { completeTask, undoTask, deleteTask } = useTodo();

  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{task.text}</span>

      {!task.done ? (
        <button
          className="render-container__item-button"
          style={{ backgroundColor: "#28a745" }}
          onClick={() => completeTask(task.id)}
        >
          완료
        </button>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="render-container__item-button"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => undoTask(task.id)}
          >
            되돌리기
          </button>
          <button
            className="render-container__item-button"
            onClick={() => deleteTask(task.id)}
          >
            삭제
          </button>
        </div>
      )}
    </li>
  );
}
