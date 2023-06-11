import { FC } from 'react'
import classes from '@/components/common/dialog/Spinner.module.scss'
import { Dialog } from 'primereact/dialog'
import { useAppSelector } from '@/hooks/useAppStore'

const Spinner: FC = () => {
  const spinnerQueue = useAppSelector(state => state.dialog.spinner.queue)
  return (
    <Dialog
      className={classes.spinner}
      visible={spinnerQueue.length > 0}
      showHeader={false}
      onHide={() => undefined}
      contentClassName={classes.content}
    >
      <div className={classes.loader}></div>
    </Dialog>
  )
}

export default Spinner
