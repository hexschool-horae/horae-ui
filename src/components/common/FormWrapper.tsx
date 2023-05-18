import { ReactNode, cloneElement, ReactElement, ChangeEvent } from 'react'
import { Controller } from 'react-hook-form'

import { classNames } from 'primereact/utils'

/**
 * label: 標籤名稱
 *
 * name: HTML Attribute Name
 *
 * control: React Hook Form control
 *
 */
/* eslint-enable */
export default function FormWrapper({
  name,
  label,
  className,
  control,
  children,
}: {
  name: string
  label: string
  className?: string
  children: ReactNode
  control: any //型別怎麼定義有待研究
}) {
  return (
    <div className={classNames(className, 'next-form-wrap')}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col itmes-start">
            <label htmlFor={field.name} className={classNames({ 'p-error': fieldState.error })}>
              {label}
            </label>

            {/* cloneElement 方法可以用 render 方法代解，待研究 */}
            {/* 參考：https://stackoverflow.com/questions/42261783/how-to-assign-the-correct-typing-to-react-cloneelement-when-giving-properties-to */}
            {cloneElement(children as ReactElement<any>, {
              id: field.name,
              value: field.value,
              className: classNames({ 'p-invalid': fieldState.error }),
              onChange: (e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value),
            })}

            {fieldState.error?.message && <small className="p-error">{fieldState.error?.message}</small>}
          </div>
        )}
      />
    </div>
  )
}

// 取得表單驗證錯誤訊息(舊範例供參）
// const getFormErrorMessage = (name: TFieldName) => {
// 	if (name === undefined) return;

// 	return errors[name] ? <small className="p-error">{errors[name]?.message}</small> : <small className="p-error">&nbsp;</small>;
// };
