import { useState } from 'react'
import style from './cardPopups.module.scss'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Chip } from 'primereact/chip'
import CardPopupWrapper from './CardPopupWrapper'

interface ICardPopupTagsProps {
  label: string
}

type TStep = 'select' | 'add'

export default function CardPopupTags({ label }: ICardPopupTagsProps) {
  const [currentStep, setCurrentStep] = useState<TStep>('select')

  const tagColorList = [
    '#ffe4e2',
    '#ffe1d6',
    '#fff1bc',
    '#e8fcde',
    '#e8f1fc',
    '#f2e8fc',
    '#fce8f7',
    '#eaeaea',
    '#f7f7f7',
  ]
  const [tagColor, setTagColor] = useState(tagColorList[0])
  const [tagTitle, setTagTitle] = useState('標籤')

  return (
    <CardPopupWrapper title="標籤" label={label}>
      {(currentStep === 'select' && (
        <div>
          <InputText placeholder="搜尋標籤" className="w-full my-2" />
          <Divider />
          <div className="text-xs mb-2">標籤</div>
          <ul className="flex gap-2">
            <li>
              <Chip label="標籤" className="text-sm" />
            </li>
            <li>
              <Chip label="標籤" className="text-sm" />
            </li>
          </ul>
          <Button
            label="建立新標籤"
            severity="secondary"
            rounded
            className="w-full mt-5"
            onClick={() => setCurrentStep('add')}
          />
        </div>
      )) ||
        (currentStep === 'add' && (
          <div>
            <div className="flex justify-center py-10 mb-5 bg-gray-100">
              <Chip label={tagTitle} className="text-sm" style={{ backgroundColor: tagColor }} />
            </div>
            <label htmlFor="todo-title">標題</label>
            <InputText
              placeholder="標籤標題"
              id="todo-title"
              aria-describedby="todo-title-help"
              className="w-full my-2"
              value={tagTitle}
              onChange={e => setTagTitle(e.target.value)}
            />
            <Divider />
            <div className="text-xs mb-2">顏色</div>
            <ul className="flex justify-center flex-wrap gap-3">
              {tagColorList.map(color => (
                <li
                  key={color}
                  className={`w-[42px] h-[42px] p-[3px] rounded-full ${style.tag_color_item}
                      ${tagColor === color ? style.selected_tag : ''}
                    `}
                >
                  <label
                    className="inline-block w-full h-full rounded-full cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => setTagColor(color)}
                  >
                    <input type="radio" name="tag-color" value={color} className="hidden" />
                  </label>
                </li>
              ))}
            </ul>
            <Button label="建立" severity="secondary" rounded className="w-full mt-4" />
            <Button
              label="返回"
              severity="secondary"
              rounded
              outlined
              className="w-full mt-3"
              onClick={() => setCurrentStep('select')}
            />
          </div>
        ))}
    </CardPopupWrapper>
  )
}
