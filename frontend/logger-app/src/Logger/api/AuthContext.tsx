/*
認証状態を管理するためのコンテキスト（AuthContext）とプロバイダ（AuthProvider）を定義。
AuthContext → 認証情報をグローバルに管理
AuthProvider で Context を提供 → アプリ全体で使えるようにする
アプリケーション全体でユーザーの認証状態を管理し、認証が必要なコンポーネントで簡単に
認証状態に基づいたレンダリングやリダイレクトを行う。
*/

import { createContext, useState, useContext, useEffect } from "react";
import { fetchAsyncTokenRefresh, fetchAsyncTokenVerify } from "./ApiAuth";

// AuthContextの型を定義
type AuthContextType = {
  isAuth: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ユーザーがログインした時に呼び出される関数
  const login = () => {
    setIsAuth(true);
  };

  // ユーザーがログアウトした時に呼び出される関数
  const logout = () => {
    setIsAuth(false);
  };

  useEffect(() => {
    const verifyUser = async () => {
      // アクセストークンを使用してユーザー情報を取得するAPIリクエスト
      try {
        const response = await fetchAsyncTokenVerify();
        setIsLoading(false);
        setIsAuth(true);
        return response;

      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          try {
            // リフレッシュトークンを使用して新しいアクセストークンを取得
            await fetchAsyncTokenRefresh();
            // 新しいアクセストークンでユーザー情報取得のリクエストを再試行
            const retryResponse = await fetchAsyncTokenVerify();
            setIsLoading(false);
            setIsAuth(true);
            return retryResponse;
          } catch (error: any) {
            setIsLoading(false);
            setIsAuth(false);
          }
        }
      }
    };
    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};