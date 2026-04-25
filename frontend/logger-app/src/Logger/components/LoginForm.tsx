import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { fetchAsyncLoginUser } from "../api/ApiAuth.tsx";
import { useAuthContext } from "../api/AuthContext.tsx";
import Loading from "./Loading.tsx";

const LoginForm = () => {
    const navigate = useNavigate();
    const { isAuth, isLoading, login } = useAuthContext();
    const [ loginError, setLoginError] = useState("");

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("メールアドレスが正しくありません")
            .required("メールアドレスを入力してください"),
        password: Yup.string().required("パスワードを入力してください"),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (state: { email: string, password: string }): Promise<void> => {
        try {
            await fetchAsyncLoginUser(state.email, state.password);
            login();
            navigate("/");
        } catch (error: any) {
            setLoginError(error.detail || "ログインに失敗しました。再度お試しください。");
        }
    };
    
    useLayoutEffect(() => {
        if (isAuth) {
         navigate("/");
        }
    }, [isAuth, navigate]);

    if (isLoading) {
      return <Loading />;
    }

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-top-box">
                <dl>
                    <dt>E-mail</dt>
                    <dd>
                        <input type="email" {...register("email")} placeholder="メールアドレスを入力してください" />
                        <p className="c-txt-error">{errors.email?.message}</p>
                    </dd>
                </dl>
                <dl>
                    <dt>Password</dt>
                    <dd>
                        <input type="password" {...register("password")} placeholder="パスワードを入力してください" />
                        <p className="c-txt-error">{errors.password?.message}</p>
                    </dd>
                </dl>
            </div>

            {loginError && (
            <p className="c-txt-error">メールアドレスかパスワードが間違っています。</p>
            )}

            <button className="c-btn" type="submit">Login</button>
        </form>
        <p className="u-txt-right">
            <a href="#">パスワードをお忘れですか？<span className="c-arrow-long"></span></a>
        </p>
        </>
    );
};

export default LoginForm;