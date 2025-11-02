import { useCustomFetch } from '../hooks/useCustomFetch';
import type { WelcomeData } from '../types';

interface UserCardProps {
  userId: number;
}

/**
 * 사용자 카드 컴포넌트
 * useCustomFetch 훅을 사용하여 사용자 데이터를 가져옵니다.
 */
const UserCard = ({ userId }: UserCardProps) => {
  const { data, isPending, isError } = useCustomFetch<WelcomeData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isPending) {
    return (
      <div className="user-card">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="user-card error">
        <h3>❌ 에러 발생</h3>
        <p>데이터를 불러오는데 실패했습니다.</p>
        <p className="error-note">콘솔을 확인하여 재시도 로그를 확인하세요.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="user-card">
        <p>데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="user-card success">
      <div className="user-header">
        <div className="user-avatar">
          {data.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{data.name}</h2>
          <p className="username">@{data.username}</p>
        </div>
      </div>

      <div className="user-info">
        <div className="info-item">
          <span className="label">📧 Email:</span>
          <span>{data.email}</span>
        </div>
        <div className="info-item">
          <span className="label">📱 Phone:</span>
          <span>{data.phone}</span>
        </div>
        <div className="info-item">
          <span className="label">🌐 Website:</span>
          <span>{data.website}</span>
        </div>
        <div className="info-item">
          <span className="label">📍 Address:</span>
          <span>{data.address.street}, {data.address.city}</span>
        </div>
        <div className="info-item">
          <span className="label">🏢 Company:</span>
          <span>{data.company.name}</span>
        </div>
      </div>

      <div className="cache-note">
        <p>💡 <strong>팁:</strong> 이 데이터는 캐시되어 있습니다. 개발자 도구의 Network 탭에서 확인해보세요!</p>
      </div>
    </div>
  );
};

export default UserCard;

