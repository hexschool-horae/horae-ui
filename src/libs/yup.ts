import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: '此為必填欄位',
    notType: value => {
      let chType = ''

      switch (value.type) {
        case 'number':
          chType = '數字'
          break

        case 'string':
          chType = '文字'
          break

        default:
          chType = ''
          break
      }

      return `輸入值必須為${chType}`
    },
  },
  string: {
    max: '長度不得超過${max}個字元',
    min: '長度不得少於${min}個字元',
    email: '請填寫有效之電子郵件',
  },
  number: {
    min: '輸入數值不可小於${min}',
    max: '輸入數值不可大於${max}',
    integer: '輸入必須為整數',
    positive: '輸入不可為負數',
  },
})

export default yup
