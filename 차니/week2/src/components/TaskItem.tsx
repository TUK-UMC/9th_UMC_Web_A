type Task = { id: number; text: string; done: boolean };

type Props = {
  task: Task;
  // handler props-drilling 종착지
  onComplete?: (id: number) => void;
  onUndo?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function TaskItem({
  task,
  onComplete,
  onUndo,
  onDelete,
}: Props) {
  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{task.text}</span>

      {!task.done ? (
        <button
          className="render-container__item-button"
          style={{ backgroundColor: "#28a745" }}
          // props-drilling으로 전달된 handler의 최종 소비 지점
          onClick={() => onComplete?.(task.id)}
        >
          완료
        </button>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="render-container__item-button"
            style={{ backgroundColor: "#28a745" }}
            // props-drilling으로 전달된 handler의 최종 소비 지점
            onClick={() => onUndo?.(task.id)}
          >
            되돌리기
          </button>
          <button
            className="render-container__item-button"
            // props-drilling으로 전달된 handler의 최종 소비 지점
            onClick={() => onDelete?.(task.id)}
          >
            삭제
          </button>
        </div>
      )}
    </li>
  );
}
