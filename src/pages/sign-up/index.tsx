import Head from 'next/head'
import Link from 'next/link'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'

import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

import { useAppDispatch } from '@/hooks/useAppStore'
import { setIsLogin, setToken } from '@/slices/userSlice'
import axiosFetcher from '@/apis/axios'
import { useRouter } from 'next/router'

import ValidateController from '@/components/common/ValidateController'

const { post } = axiosFetcher

const schema = yup
  .object({
    email: yup.string().required().email(),
    password: yup.string().required().min(8).max(12),
  })
  .required()

// 註冊基本表單欄位
interface IRegisterForm {
  email: string
  password: string
}

interface IRegisterResponse {
  user: {
    token: string
  }
}

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
    const result = await post<IRegisterResponse>('/user/sign-up', submitData, false)

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

      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-5">註冊</h1>

        <div className="flex flex-col">
          <ValidateController name="email" label="電子信箱" control={control}>
            <InputText />
          </ValidateController>
        </div>

        <div className="flex flex-col mb-5">
          <ValidateController name="password" label="密碼" control={control}>
            <InputText />
          </ValidateController>
        </div>

        <Button className=" bg-red-600 px-10 mb-6" onClick={handleSubmit(onSubmit)} rounded>
          註冊
        </Button>
        <div>
          已經有帳號了？
          <Link href="login">
            <Button className="text-red-600 p-0" link>
              登入
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
