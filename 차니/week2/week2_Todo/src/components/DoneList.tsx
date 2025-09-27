import { useTodo } from "../contexts/TodoContext";
import TaskItem from "./TaskItem";

export default function DoneList() {
  const { doneList } = useTodo();
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">완료</h2>
      <ul className="render-container__list">
        {doneList.map((t) => (
          <TaskItem key={t.id} task={t} />
        ))}
      </ul>
    </div>
  );
}
