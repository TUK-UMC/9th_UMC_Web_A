import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

/**
 * Google 로그인 콜백 처리 컴포넌트
 * 서버에서 리다이렉트된 URL의 토큰을 추출하고 로그인 처리
 */
const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        setStatus('loading');
        setMessage('Google 로그인 처리 중...');

        // URL에서 쿼리 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const name = urlParams.get('name');
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');
        
        if (!userId || !name || !accessToken || !refreshToken) {
          throw new Error('필수 정보를 찾을 수 없습니다.');
        }

        // 사용자 정보 구성
        const userInfo = {
          id: parseInt(userId),
          name: decodeURIComponent(name), // URL 디코딩
          email: 'google@example.com', // Google 로그인에서는 이메일이 별도로 전달되지 않을 수 있음
          accessToken,
          refreshToken,
        };

        // 로그인 처리
        login(userInfo);
        
        setStatus('success');
        setMessage('Google 로그인에 성공했습니다!');
        
        // 2초 후 마이페이지로 이동
        setTimeout(() => {
          navigate('/mypage');
        }, 2000);

      } catch (error) {
        console.error('Google 로그인 실패:', error);
        setStatus('error');
        setMessage('Google 로그인에 실패했습니다. 다시 시도해주세요.');
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleGoogleCallback();
  }, []); // 의존성 배열을 비워서 컴포넌트 마운트 시에만 실행

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-400">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <p className="text-green-400 text-lg">{message}</p>
            <p className="text-gray-400 text-sm mt-2">마이페이지로 이동합니다...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <p className="text-red-400 text-lg">{message}</p>
            <p className="text-gray-400 text-sm mt-2">로그인 페이지로 이동합니다...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
