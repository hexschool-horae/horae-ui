import style from './cardPopups.module.scss'
import { useEffect, useMemo, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { useAppSelector } from '@/hooks/useAppStore'
import { useCardDetail } from '@/contexts/cardDetailContext'
import CardPopupWrapper from './CardPopupWrapper'
import IconPause from '@/assets/icons/icon_pause.svg'
import IconClose from '@/assets/icons/icon_close.svg'
import IconRestart from '@/assets/icons/icon_restart.svg'

interface ICardPopupPomodoroProps {
  label: string
}
type TStep = 'setting' | 'pomodoro'

interface INewTimer {
  count: number
  work: number
  break: number
}

export default function CardPopupPomodoro({ label }: ICardPopupPomodoroProps) {
  const { state } = useCardDetail()
  const [popupWidth, setPopupWidth] = useState('610px')
  const [currentStep, setCurrentStep] = useState<TStep>('setting')
  const [isDisabled, setIsDisabled] = useState(false)
  const [newTimer, setNewTimer] = useState<INewTimer>({
    count: 1,
    work: 25,
    break: 5,
  })

  // useEffect(() => {
  // 	console.log(newTimer)
  // }, [newTimer])

  const handleChange = (e: InputNumberChangeEvent, name: string) => {
    if (e.value == null) {
      setIsDisabled(true)
      return
    } else {
      setIsDisabled(false)
    }

    switch (name) {
      case 'count':
        setNewTimer({
          ...newTimer,
          count: e.value,
        })
        break
      case 'work':
        setNewTimer({
          ...newTimer,
          work: e.value,
        })
        break
      case 'break':
        setNewTimer({
          ...newTimer,
          break: e.value,
        })
        break
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    chkValue()
    setCurrentStep('pomodoro')
  }

  function chkValue() {
    if (newTimer.work == 0) {
      setNewTimer(prev => {
        return {
          ...prev,
          work: 0.1,
        }
      })
    }
    if (newTimer.break == 0) {
      setNewTimer(prev => {
        return {
          ...prev,
          break: 0.1,
        }
      })
    }
    if (newTimer.count == 0) {
      setNewTimer(prev => {
        return {
          ...prev,
          count: 1,
        }
      })
    }
  }

  const onReset = () => {
    setPopupWidth('610px')
    setCurrentStep('setting')
  }

  useEffect(() => {
    currentStep === 'pomodoro' && !state.maximize ? setPopupWidth('300px') : setPopupWidth('610px')
  }, [state.maximize])

  return (
    <CardPopupWrapper title="番茄鐘" label={label} wh={popupWidth} maximizable={currentStep === 'pomodoro'}>
      {currentStep === 'setting' ? (
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 justify-center">
            <div className="text-center">
              <label htmlFor="conut" className="block mb-1">
                番茄數
              </label>
              <InputNumber
                inputId="conut"
                min={1}
                max={100}
                inputClassName={style.pomodoro_input}
                value={newTimer.count}
                onChange={e => handleChange(e, 'count')}
              />
            </div>
            <div className="text-center">
              <label htmlFor="work" className="block mb-1">
                番茄鐘時長（分）
              </label>
              <InputNumber
                inputId="work"
                min={0.1}
                max={100}
                inputClassName={style.pomodoro_input}
                value={newTimer.work}
                onChange={e => handleChange(e, 'work')}
              />
            </div>
            <div className="text-center">
              <label htmlFor="break" className="block mb-1">
                休息時長（分）
              </label>
              <InputNumber
                inputId="break"
                min={0.1}
                max={100}
                inputClassName={style.pomodoro_input}
                value={newTimer.break}
                onChange={e => handleChange(e, 'break')}
              />
            </div>
          </div>
          <Button
            type="submit"
            label="確定"
            severity="secondary"
            rounded
            className="w-full mt-8"
            disabled={isDisabled}
          />
        </form>
      ) : (
        <Timer newTimer={newTimer} onReset={onReset} />
      )}
    </CardPopupWrapper>
  )
}

interface ICountdownTimer {
  remainingTime: number
}
type TActiveTimer = 'work' | 'break'
interface ITimerProps {
  newTimer: INewTimer
  onReset: () => void
}

const Timer = ({ newTimer, onReset }: ITimerProps) => {
  const { state, dispatch } = useCardDetail()
  const socketCardTitle = useAppSelector(state => state.board.cardDetail?.title) || ''
  const [startCountdown, setStartCountdown] = useState(false)
  const [activeTimer, setActiveTimer] = useState<TActiveTimer>('work')
  const [time, setTime] = useState(0)
  const [key, setKey] = useState(0)
  const [count, setCount] = useState(0)

  const alarmSound = useMemo(() => {
    return new Audio('/clock-alarm.mp3')
  }, [])

  const children = ({ remainingTime }: ICountdownTimer) => {
    const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0')
    const seconds = String(remainingTime % 60).padStart(2, '0')

    return `${minutes}:${seconds}`
  }

  const setTimerTime = (active: string) => {
    switch (active) {
      case 'work':
        setTime(newTimer.work)
        break
      case 'break':
        setTime(newTimer.break)
        break
      default:
        setTime(0)
        break
    }
  }

  const handlePauseTimer = () => {
    startCountdown ? pauseTimer() : startTimer()
  }

  const pauseTimer = () => {
    setStartCountdown(false)
  }

  const startTimer = () => {
    stopAlarm()
    setStartCountdown(true)
  }

  const replayTimer = () => {
    setKey(prev => prev + 1)
  }

  const resetTimer = () => {
    stopAlarm()
    dispatch({
      type: 'MAXIMIZE_POPUP',
      payload: false,
    })
    onReset()
  }

  const handleComplete = () => {
    alarmSound.play()
    setStartCountdown(false)

    if (activeTimer === 'break' && count === 1) {
      setTimeout(() => resetTimer(), 2500)
      return
    }

    if (activeTimer == 'work') {
      setActiveTimer('break')
      setTimerTime('break')
    } else {
      setActiveTimer('work')
      setTimerTime('work')
      setCount(prev => prev - 1)
    }

    replayTimer()
  }

  function stopAlarm() {
    alarmSound.pause()
    alarmSound.currentTime = 0
  }

  useEffect(() => {
    dispatch({
      type: 'MAXIMIZE_POPUP',
      payload: true,
    })
    setTimerTime(activeTimer)
    setCount(newTimer.count)
    setKey(prev => prev + 1)
  }, [])

  return (
    <div className={`max-w-3xl mx-auto ${!state.maximize && 'flex items-center justify-center gap-10'}`}>
      {state.maximize && (
        <>
          <h5 className="text-center pt-3">{socketCardTitle}</h5>
          <div className="w-full rounded-full bg-secondary-4 p-2 mt-12 mb-16 flex">
            <div
              className={`${style.pomodoro_tab} 
							${activeTimer === 'work' ? 'bg-secondary-1 text-white' : 'bg-secondary-4 text-secondary-3'}`}
            >
              番茄鐘
            </div>
            <div
              className={`${style.pomodoro_tab}
							${activeTimer === 'break' ? 'bg-secondary-1 text-white' : 'bg-secondary-4 text-secondary-3'}`}
            >
              休息
            </div>
          </div>
        </>
      )}
      <div className={`flex justify-center ${state.maximize ? 'text-4xl' : style.hide_pomodoro_animate}`}>
        <CountdownCircleTimer
          key={key}
          size={state.maximize ? 320 : 60}
          strokeWidth={8}
          trailColor="#FFF1F1"
          isPlaying={startCountdown}
          duration={time * 60}
          colors="#FF6848"
          onComplete={handleComplete}
        >
          {children}
        </CountdownCircleTimer>
      </div>
      <div className={`${style.pomodoro_func_btns} ${!state.maximize && 'mt-0'}`}>
        <Button
          icon={IconRestart}
          rounded
          outlined
          aria-label="Replay"
          className={`${style.pomodoro_func_btn} ${!state.maximize && 'hidden'}`}
          onClick={replayTimer}
        />
        <Button
          icon={IconPause}
          rounded
          outlined
          aria-label="Pause"
          className={`${style.pomodoro_func_btn} ${style.lg}  
						${!startCountdown && 'bg-secondary-4 border-secondary-3'}
					`}
          onClick={handlePauseTimer}
        />

        <Button
          icon={IconClose}
          rounded
          outlined
          aria-label="Times"
          className={`${style.pomodoro_func_btn} ${!state.maximize && 'hidden'}`}
          onClick={resetTimer}
        />
      </div>
    </div>
  )
}
