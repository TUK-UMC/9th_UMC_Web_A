import { Outlet } from 'react-router-dom';
import { Header } from '../../shared/ui';
import { MovieProvider } from '../../shared/contexts';

// 공용 레이아웃 컴포넌트
export const AppLayout = () => {
  return (
    <MovieProvider>
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </MovieProvider>
  );
};
