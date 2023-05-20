import Head from 'next/head'
import { useEffect, useState, useMemo } from 'react'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'

import { classNames } from 'primereact/utils'
import axiosFetcher from '@/apis/axios'

const { patch, get } = axiosFetcher

/** patch 使用者個人資訊 */
interface IProfileForm {
  name: string
}

/** get 使用者個人資訊 */
interface IProfileData {
  data: {
    name: string
    email: string
    _id: string
  }
}

const schema = yup.object({
  name: yup.string().required(),
})

export default function Profile() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: useMemo(() => ({ name: username }), [username]),
    resolver: yupResolver(schema),
  })

  /** 呈現表單驗證錯誤訊息 */
  const getFormErrorMessage = (name: 'name') => {
    if (name === undefined) return

    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    )
  }

  /** 取得 B01-8 使用者個人資訊，並更新個人資訊*/
  const handleGetProfileData = async () => {
    const result = await get<IProfileData>('/user/profile')

    if (result === undefined) return

    const {
      data: { name, email },
    } = result
    setUsername(name)
    setEmail(email)
  }

  const onSubmit = async (submitData: IProfileForm) => {
    /* eslint-enable */
    const result = await patch<any>('/user/profile', submitData)

    if (result === undefined) return

    handleGetProfileData()
    // 重置表單
    reset()
  }

  /** 當 username 改變時，更新 hook form 裡的 name 欄位e*/
  useEffect(() => {
    reset({ name: username })
  }, [username])

  /** 頁面載入時，取得並更新使用者個人資訊 */
  useEffect(() => {
    handleGetProfileData()
  }, [])

  return (
    <>
      <Head>
        <title>Horae - 個人資訊</title>
      </Head>

      <div className="flex flex-col mb-5">
        <h2 className="text-2xl font-bold mb-6">
          <span>{username} 的個人資訊</span>
        </h2>

        <label htmlFor="email" className="mb-3">
          電子信箱
        </label>
        <InputText id="email" className="mb-6" value={email} disabled />

        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <label htmlFor={field.name} className={classNames({ 'p-error': errors.name }, 'mb-3')}>
                個人暱稱
              </label>

              <InputText
                id={field.name}
                value={field.value}
                className={classNames({ 'p-invalid': fieldState.error })}
                onChange={e => field.onChange(e.target.value)}
              />

              {getFormErrorMessage(field.name)}
            </>
          )}
        />
      </div>

      <Button label="修改暱稱" size="small" onClick={handleSubmit(onSubmit)} />
    </>
  )
}
