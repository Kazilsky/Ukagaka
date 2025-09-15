import { useRef } from 'react'
import uka from '../../../resources/character.png'

function App() {
  const characterRef = useRef(null)
  const holdTimerRef = useRef(null)

  const handleMouseDown = (event) => {
    if (event.button === 1) { // Средняя кнопка
      event.preventDefault()
      
      // Запускаем таймер на 1 секунду
      holdTimerRef.current = setTimeout(() => {
        console.log('Удержано 1 секунду!')
        if (window.electronAPI?.startDrag) {
          window.electronAPI.startDrag()
        }
      }, 1000)
    }
  }

  const handleMouseUp = (event) => {
    if (event.button === 1) {
      // Отменяем таймер если кнопку отпустили раньше
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
        holdTimerRef.current = null
        console.log('Отпущено раньше 1 секунды')
      }
    }
  }

  const handleMouseLeave = () => {
    // Отменяем если мышь ушла с элемента
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  return (
    <div className="app-container">
      <img
        ref={characterRef}
        src={uka}
        className="uka-character"
        alt="Ukagaka character"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'move' }}
      />
    </div>
  )
}

export default App