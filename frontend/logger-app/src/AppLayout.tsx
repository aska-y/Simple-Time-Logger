// 認証されたユーザーのみがアクセスできるようするためにプライベートルートを実装。
// AuthContextで認証されている場合のみ、任意のコンポーネントにアクセスできる。
// それ以外はLoginページにリダイレクト。

import { useAuthContext } from "./Logger/api/AuthContext.tsx";
import Loading from "./Logger/components/Loading.tsx";
import { Navigate, Outlet, useLocation } from 'react-router';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

export const PrivateRoute = () => {
  const { isAuth, isLoading } = useAuthContext();// 認証ロジック
  const location = useLocation();
  // 認証チェック中（ローディング）
  if (isLoading) {
    return <Loading />;
  }

  // 認証済みであれば、子ルート（Outlet）を表示
  if (isAuth) {
    return (
      <div className="content-wrapper">
      <Header />
      <main>
        <Outlet/>
      </main>
      <Footer />
    </div>
    )
  }

  // 未認証であれば、ログインページへリダイレクト
  // return <Navigate to="/signin" />;
  // ログイン後、元の場所に戻れるように現在のlocationをstateで渡す  
  return <Navigate to="/login"  state={{ from: location }} replace />
};

export default PrivateRoute;