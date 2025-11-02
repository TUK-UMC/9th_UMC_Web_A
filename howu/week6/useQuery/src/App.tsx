import { useState } from "react";
import UserCard from "./components/UserCard";
import "./App.css";

function App() {
  const [userId, setUserId] = useState(1);

  const userIds = [1, 2, 3, 4, 5];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 useCustomFetch 예제</h1>
        <p>캐싱, 재시도 로직이 포함된 커스텀 데이터 fetching 훅</p>
      </header>

      <div className="controls">
        <div className="user-selector">
          <label htmlFor="userId">👤 사용자 ID 선택:</label>
          <select
            id="userId"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
          >
            {userIds.map((id) => (
              <option key={id} value={id}>
                사용자 {id}
              </option>
            ))}
          </select>
        </div>

        <button
          className="clear-cache-btn"
          onClick={() => {
            localStorage.clear();
            alert("캐시가 초기화되었습니다!");
            window.location.reload();
          }}
        >
          🗑️ 캐시 초기화
        </button>
      </div>

      <div className="user-container">
        <UserCard userId={userId} />
      </div>

      <div className="features">
        <h2>✨ 주요 기능</h2>
        <ul>
          <li>
            📦 <strong>캐싱:</strong> localStorage에 데이터를 캐시하여 불필요한
            네트워크 요청 방지
          </li>
          <li>
            ⏱️ <strong>STALE_TIME:</strong> 5분 동안 캐시된 데이터 사용
          </li>
          <li>
            🔄 <strong>재시도:</strong> 실패 시 최대 3번 자동 재시도 (지수
            백오프)
          </li>
          <li>
            ❌ <strong>요청 취소:</strong> 컴포넌트 언마운트 시 진행 중인 요청
            취소
          </li>
          <li>
            ⚡ <strong>빠른 로딩:</strong> 캐시된 데이터로 즉시 UI 표시
          </li>
        </ul>
      </div>

      <div className="test-instructions">
        <h2>🧪 테스트 방법</h2>
        <ol>
          <li>
            사용자를 변경하면 네트워크 요청이 발생하고 데이터가 캐시됩니다.
          </li>
          <li>같은 사용자를 다시 선택하면 캐시된 데이터가 즉시 표시됩니다.</li>
          <li>개발자 도구의 Network 탭에서 캐시 동작을 확인하세요.</li>
          <li>
            Application 탭의 Local Storage에서 캐시된 데이터를 확인하세요.
          </li>
          <li>네트워크를 끄고 데이터를 로드하면 캐시된 데이터가 표시됩니다.</li>
        </ol>
      </div>
    </div>
  );
}

export default App;
