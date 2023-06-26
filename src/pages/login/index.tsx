import Head from 'next/head'
import Link from 'next/link'
import classes from '@/pages/login/login.module.scss'
import { useForm } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useAppDispatch } from '@/hooks/useAppStore'
import { setIsLogin, setToken, setProfile } from '@/slices/userSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'
import ValidateController from '@/components/common/ValidateController'
import { POST_USER_LOGIN } from '@/apis/axios-service'
const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required().min(8).max(12),
  })
  .required()

// 註冊基本表單欄位
interface IRegisterForm {
  email: string
  password: string
}

export default function Register() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })

  const dispatch = useAppDispatch()

  const onSubmit = async (submitData: IRegisterForm) => {
    const result = await POST_USER_LOGIN(submitData)
    if (result === undefined) return
    const { token, email, name, avatar } = result?.user ?? null

    dispatch(setToken(token))
    dispatch(setIsLogin(true))
    dispatch(
      setProfile({
        email,
        name,
        avatar,
      })
    )
    // 重置表單
    reset()
  }

  return (
    <>
      <Head>
        <title>Horae - 登入</title>
      </Head>
      <div className="w-full h-full flex items-center justify-center">
        <div className={classes['login-form-box']}>
          <div className={classes.title}>Horae - 登入</div>
          <ValidateController name="email" label="電子信箱" control={control} className="mt-5">
            <InputText type="text" />
          </ValidateController>
          <ValidateController name="password" label="密碼" control={control} className="mt-5">
            <InputText type="password" />
          </ValidateController>
          <Button className={`${classes['btn-login']} mt-7`} onClick={handleSubmit(onSubmit)} rounded>
            登入
          </Button>
          <div className="flex items-center mt-2">
            <span>還沒有註冊帳號？</span>
            <Link href="sign-up" className="text-red-600 underline">
              註冊
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
