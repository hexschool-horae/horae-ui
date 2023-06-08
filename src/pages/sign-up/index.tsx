import Head from 'next/head'
import Link from 'next/link'
import classes from '@/pages/login/login.module.scss'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'

import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

import { useAppDispatch } from '@/hooks/useAppStore'
import { setIsLogin, setToken } from '@/slices/userSlice'
import { useRouter } from 'next/router'
import { IRegisterForm } from '@/apis/interface/api'
import ValidateController from '@/components/common/ValidateController'

import { POST_SIGN_UP } from '@/apis/axios-service'

const schema = yup
  .object({
    email: yup.string().required().email(),
    password: yup.string().required().min(8).max(12),
  })
  .required()

// 註冊基本表單欄位
export default function Register() {
  const router = useRouter()
  // 取首頁輸入註冊email
  const login_hint = router.query.login_hint as string

  const defaultValues = {
    email: login_hint ?? '',
    password: '',
  }

  const { control, handleSubmit, reset } = useForm({ defaultValues, resolver: yupResolver(schema) })

  const dispatch = useAppDispatch()

  const onSubmit = async (submitData: IRegisterForm) => {
    const result = await POST_SIGN_UP(submitData)
    if (result === undefined) return
    const { token } = result?.user ?? {}

    dispatch(setToken(token))
    dispatch(setIsLogin(true))
    // 重置表單
    reset()
  }

  return (
    <>
      <Head>
        <title>Horae - 註冊</title>
      </Head>
      <div className="w-full h-full flex items-center justify-center">
        <div className={classes['login-form-box']}>
          <div className={classes.title}>Horae - 註冊</div>
          <ValidateController name="email" label="電子信箱" control={control} className="mt-5">
            <InputText />
          </ValidateController>
          <ValidateController name="password" label="密碼" control={control} className="mt-5">
            <InputText />
          </ValidateController>
          <Button className={`${classes['btn-login']} mt-7`} onClick={handleSubmit(onSubmit)} rounded>
            註冊
          </Button>
          <div className="flex items-center mt-2">
            <span>已經有帳號了？</span>
            <Link href="login" className="text-red-600 underline">
              登入
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
