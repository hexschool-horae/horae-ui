import Head from 'next/head'
import Link from 'next/link'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

import { useAppDispatch } from '@/hooks/useAppStore'
import { setIsLogin, setToken } from '@/slices/userSlice'
import axiosFetcher from '@/apis/axios'

import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'
import { Dialog } from 'primereact/dialog'

import ValidateController from '@/components/common/ValidateController'

const { post } = axiosFetcher

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

interface IRegisterResponse {
  user: {
    token: string
  }
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
  const [visible, setVisible] = useState(false)

  const onSubmit = async (submitData: IRegisterForm) => {
    setVisible(true)

    const result = await post<IRegisterResponse>('user/login', submitData, false)

    setVisible(false)

    if (result === undefined) return
    const { token } = result?.user ?? null

    dispatch(setToken(token))
    dispatch(setIsLogin(true))
    // 重置表單
    reset()
  }

  return (
    <>
      <Head>
        <title>Horae - 登入</title>
      </Head>

      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-5">登入</h1>

        <div className="flex flex-col">
          <ValidateController name="email" label="電子信箱" control={control}>
            <InputText />
          </ValidateController>
        </div>

        <div className="flex flex-col mb-5">
          <ValidateController name="password" label="密碼" control={control}>
            <InputText type="password" />
          </ValidateController>
        </div>

        <Button className="bg-red-600 px-10 mb-6" onClick={handleSubmit(onSubmit)} rounded>
          登入
        </Button>

        <div>
          還沒有註冊帳號？
          <Link href="sign-up">
            <Button className="text-red-600 p-0" link>
              註冊
            </Button>
          </Link>
        </div>

        {/* 登入中 loading */}
        <Dialog
          header={<>載入中</>}
          visible={visible}
          focusOnShow={false}
          style={{ width: '50vw' }}
          onHide={() => setVisible(false)}
        >
          <p className="text-center text-lg">登入中，請稍候</p>
        </Dialog>
      </div>
    </>
  )
}
