import { Button } from 'primereact/button'
import yup from '@/libs/yup'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { classNames } from 'primereact/utils'
import { InputText } from 'primereact/inputtext'
import homeStyles from './home.module.scss'

const schema = yup
  .object({
    email: yup.string().required().email(),
  })
  .required()

interface IRegisterForm {
  email: string
}

type TFieldName = 'email' | undefined

interface Props {
  label: string
  severity: 'danger' | 'secondary'
}

export default function RegisterEmailForm({ label, severity }: Props) {
  const router = useRouter()
  const defaultValues = {
    email: '',
  }
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues, resolver: yupResolver(schema) })

  // 取得表單驗證錯誤訊息
  const getFormErrorMessage = (name: TFieldName) => {
    if (!name) return

    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    )
  }

  const onSubmit = async (submitData: IRegisterForm) => {
    router.push({
      pathname: '/sign-up',
      query: { login_hint: submitData.email },
    })
    reset()
  }

  return (
    <div className="flex">
      <div className="input w-[70%] max-w-[320px]">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <InputText
                id={field.name}
                value={field.value}
                className={`${classNames({ 'p-invalid': fieldState.error })} !w-full ${
                  fieldState.error ? '' : 'border-transparent'
                }`}
                placeholder="電子郵件"
                onChange={e => field.onChange(e.target.value)}
              />

              {getFormErrorMessage(field.name)}
            </>
          )}
        />
      </div>
      <div className={`${homeStyles.btn_box} max-w-[115px]`}>
        <Button
          label={label}
          severity={severity}
          rounded
          className="sm:ml-3 ml-2 !w-full"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  )
}
