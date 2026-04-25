import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { fetchAsyncSignup } from "../api/ApiAuth.tsx";
import { useAuthContext } from "../api/AuthContext.tsx";
import Loading from "./Loading.tsx";

type RegisterFormValues = {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
};

const ResisterForm = () => {
    const navigate = useNavigate();
    const { isAuth, isLoading } = useAuthContext();

    const validationSchema = Yup.object({
        username: Yup.string().required("入力してください"),
        email: Yup.string().email('メールアドレスが正しくありません').required("入力してください"),
        password: Yup.string().required("入力してください").min(8, "8文字以上の長さにしてください"),
        passwordConfirm: Yup.string()
        .oneOf([Yup.ref("password")], "パスワードが一致しません")
        .required("入力してください"),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            passwordConfirm: "",
        },
    });

    const onSubmit = async (state: RegisterFormValues) => {
        await fetchAsyncSignup({
            username: state.username,
            email: state.email,
            password: state.password,
            confirmPassword: state.passwordConfirm,
        });
        navigate("/");
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
        <p className="c-txt-error">このフォームは未実装です</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-top-box">
            <dl>
                <dt>Username</dt>
                <dd>
                    <input type="text" {...register("username")} placeholder="ユーザーネームを入力してください" />
                    <p className="c-txt-error">{errors.username?.message}</p>
                </dd>
            </dl>
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
                    <input type="password" {...register("password")} placeholder="パスワードを入力してください"/>
                    <p className="c-txt-error">{errors.password?.message}</p>
                </dd>
            </dl>
            <dl>
                <dt>Confirm Password</dt>
                <dd>
                    <input type="password" {...register("passwordConfirm")} placeholder="パスワードをもう一度入力してください"/>
                    <p className="c-txt-error">{errors.passwordConfirm?.message}</p>
                </dd>
            </dl>
        </div>

        <button className="c-btn -point" type="submit">新規アカウント登録</button>

        </form>
        </>
    );
};

export default ResisterForm;