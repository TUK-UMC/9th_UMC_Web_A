import TaskItem from "./TaskItem";

type Task = { id: number; text: string; done: boolean };

type Common = {
  title: string;
  items: Task[];
};
type TodoProps = Common & {
  mode: "todo";
  onComplete: (id: number) => void;
};
type DoneProps = Common & {
  mode: "done";
  onUndo: (id: number) => void;
  onDelete: (id: number) => void;
};

type Props = TodoProps | DoneProps;

export default function TaskList(props: Props) {
  // App.tsx에서 내려온 items(data) props 사용
  const { title, items } = props;

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul className="render-container__list">
        {/* TaskItem.tsx로 hanlder props와 data props를 전달 (props-drilling 발생) */}
        {props.mode === "todo"
          ? items.map((t) => (
              <TaskItem key={t.id} task={t} onComplete={props.onComplete} />
            ))
          : items.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onUndo={props.onUndo}
                onDelete={props.onDelete}
              />
            ))}
      </ul>
    </div>
  );
}
