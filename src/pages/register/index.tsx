import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "@/libs/yup";

import useUserState from "@/hooks/useUserState";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

import axiosFetcher from "@/apis/axios";

const { post } = axiosFetcher;

const schema = yup
  .object({
    email: yup.string().required().email(),
    password: yup.string().min(8).max(12).required(),
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
  const defaultValues = {
    email: "",
    password: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const userState = useUserState();
  const { setUserIsLogin, setUserToken } = userState;

  const onSubmit = async (submitData: IRegisterForm) => {
    const result = await post<IRegisterResponse>("/user/register", submitData);

    if (result === undefined) return;

    const { token } = result?.user;

    setUserToken(token);
    setUserIsLogin(true);
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
      <h1 className="text-2xl font-bold mb-5">註冊</h1>

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
        註冊
      </Button>
    </div>
  );
}
