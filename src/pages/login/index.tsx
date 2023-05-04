import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

import { useAppDispatch } from "@/hooks/useAppStore";
import { setIsLogin, setToken } from "@/slices/userSlice";
import axiosFetcher from "@/apis/axios";

import { yupResolver } from "@hookform/resolvers/yup";
import yup from "@/libs/yup";
import { Dialog } from "primereact/dialog";

const { post } = axiosFetcher;

const schema = yup
  .object({
    email: yup.string().required().email(),
    password: yup.string().required().min(8).max(12),
  })
  .required();

// 註冊基本表單欄位
interface IRegisterForm {
  email: string;
  password: string;
}

interface IRegisterResponse {
  user: {
    token: string;
  };
}

type TFieldName = "email" | "password" | undefined;

export default function Register() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const dispatch = useAppDispatch();
  const [visible, setVisible] = useState(false);

  const onSubmit = async (submitData: IRegisterForm) => {
    setVisible(true);

    const result = await post<IRegisterResponse>(
      "user/login",
      submitData,
      false
    );

    setVisible(false);

    if (result === undefined) return;
    const { token } = result?.user;

    dispatch(setToken(token));
    dispatch(setIsLogin(true));
    // 重置表單
    reset();
  };

  // 取得表單驗證錯誤訊息
  const getFormErrorMessage = (name: TFieldName) => {
    if (name === undefined) return;

    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-5">登入</h1>

      <div className="flex flex-col">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                className={classNames({ "p-error": errors.email })}
              >
                電子信箱
              </label>

              <InputText
                id={field.name}
                value={field.value}
                className={classNames({ "p-invalid": fieldState.error })}
                onChange={(e) => field.onChange(e.target.value)}
              />

              {getFormErrorMessage(field.name)}
            </>
          )}
        />
      </div>

      <div className="flex flex-col mb-5">
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                className={classNames({ "p-error": errors.email })}
              >
                密碼
              </label>

              <InputText
                id={field.name}
                value={field.value}
                className={classNames({ "p-invalid": fieldState.error })}
                onChange={(e) => field.onChange(e.target.value)}
              />

              {getFormErrorMessage(field.name)}
            </>
          )}
        />
      </div>

      <Button
        className="bg-red-600 px-10"
        onClick={handleSubmit(onSubmit)}
        rounded
      >
        登入
      </Button>

      {/* 登入中 loading */}
      <Dialog
        header={<>載入中</>}
        visible={visible}
        focusOnShow={false}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <p className="text-center text-lg">登入中，請稍候</p>
      </Dialog>
    </div>
  );
}
