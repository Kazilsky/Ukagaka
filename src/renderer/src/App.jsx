import { useRef, useState } from 'react'
import uka from '../../../resources/character.png'

function App() {
  const [dragging, setDragging] = useState(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  /// Управление передвижением окна.
  const handleMouseDown = (event) => {
    if (event.button === 2) {
      // ПКМ
      setDragging(true)
      lastPosRef.current = { x: event.screenX, y: event.screenY }
      document.body.style.cursor = 'grabbing'
      event.preventDefault()
    }
  }
  /// Всё ещё управление передвижением окна (только теперь при отпускании ПКМ)
  const handleMouseUp = (event) => {
    if (event.button === 2) {
      setDragging(false)
      document.body.style.cursor = ''
      event.preventDefault()
    }
  }

  const handleMouseMove = (event) => {
    if (dragging) {
      const dx = event.screenX - lastPosRef.current.x
      const dy = event.screenY - lastPosRef.current.y
      lastPosRef.current = { x: event.screenX, y: event.screenY }
      if (window.electronAPI?.moveWindow) {
        window.electronAPI.moveWindow(dx, dy)
      }
    }
  }

  const handleContextMenu = (event) => {
    event.preventDefault()
  }

  const handleMouseClick = (event) => {
    window.AiRequest.get('test')
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      onClick={handleMouseClick}
      className="w-screen h-screen"
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <img
        src={uka}
        alt="Ukagaka character"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          pointerEvents: 'auto',
          userSelect: 'none',
          cursor: 'pointer'
        }}
        draggable={false}
      />
    </div>
  )
}

export default App
