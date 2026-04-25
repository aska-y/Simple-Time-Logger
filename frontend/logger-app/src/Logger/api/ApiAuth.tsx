import axiosInstance from "./AxiosInstance.tsx";
import type {SignupUser} from "../../types.tsx";

//ログイン
export const fetchAsyncLoginUser = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(
      "/api/auth/login/",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Cookie を送受信
      }
    );
    return response.data;
  } catch (error: any) {
    
    throw error.response.data;
  }
};

//ログアウト
export const fetchAsyncLogoutUser = async () => {
  try {
    await axiosInstance.post(
      "/api/auth/logout/",
      {}, // 空のPOSTリクエスト
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
  } catch (error: any) {
    throw error.response.data;
  }
};

// トークン確認
export const fetchAsyncTokenVerify = async () => {
  const response = await axiosInstance.post(
    "/api/auth/verify/",
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  console.log('Verification successful:', response.data);
  return response.data;
};

// トークンリフレッシュ
export const fetchAsyncTokenRefresh = async () => {
  await axiosInstance.post(
    "/api/auth/refresh/",
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

// ユーザー登録
export const fetchAsyncSignup = async (props: SignupUser) => {
  const formData = {
    username: props.username,
    email: props.email,
    password: props.password,
  };
  await axiosInstance.post(
    "/api/auth/users/", 
    formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
