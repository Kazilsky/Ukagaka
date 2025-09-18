import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

import standart from '../../../resources/character.png'
import pensive from '../../../resources/surface8.png'

// Функция для вызова из AI или других частей приложения
export function EmoteSwap(emoteType) {
    if (window.electronAPI) {
        // Отправляем запрос в main process
        window.electronAPI.send('change-emote', emoteType)
    } else {
        console.warn('electronAPI not available')
    }
}

function App() {
    const [dragging, setDragging] = useState(false)
    const lastPosRef = useRef({ x: 0, y: 0 })
	const imgRef = useRef(standart)

    const [showDialog, setShowDialog] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')

    const handleMouseDown = (event) => {
        if (event.button === 2) {
            setDragging(true)
            lastPosRef.current = { x: event.screenX, y: event.screenY }
            document.body.style.cursor = 'grabbing'
            event.preventDefault()
        }
    }

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

    const handleMouseClick = () => {
        setShowDialog((prev) => !prev)
    }

    const handleSend = async () => {
        if (!input.trim()) return
        const userMessage = input.trim()
        setMessages((prev) => [...prev, { from: 'user', text: userMessage }])
        setInput('')

        if (window.AiRequest?.get) {
            const reply = await window.AiRequest.get(userMessage)
            setMessages((prev) => [...prev, { from: 'gpt', text: reply }])
        }
    }


    // Функция для изменения эмоции
    window.changeEmote = (emoteType) => {
        console.log('Changing emote to:', emoteType)
        const characterImg = document.getElementById('character')
        if (!characterImg) return

        switch(emoteType) {
            case "standart":
                characterImg.src = standart
                imgRef.current = standart
                break
            case "pensive":
                characterImg.src = pensive
                imgRef.current = pensive
                break
            default:
                characterImg.src = standart
                imgRef.current = standart
        }
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={handleContextMenu}
            className="w-screen h-screen"
            style={{ position: 'fixed', top: 0, left: 0 }}
        >
            {/* Персонаж с анимацией */}
            <motion.img
                id="character"
                src={imgRef.current}
                alt="Ukagaka character"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onContextMenu={handleContextMenu}
                onClick={handleMouseClick}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    userSelect: 'none',
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                }}
                onMouseEnter={() => window.electronAPI?.setIgnoreMouse(false)}
                onMouseLeave={() => window.electronAPI?.setIgnoreMouse(true)}
                draggable={false}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />

            {/* Диалоговое окно с плавным появлением */}
            <AnimatePresence>
                {showDialog && (
                    <motion.div
                        className="absolute ml-35 left-40 top-10 w-96 bg-gradient-to-br from-white/90 to-gray-100/90 border border-gray-300 rounded-2xl shadow-xl flex flex-col"
                        style={{ pointerEvents: 'auto' }}
                        onMouseEnter={() => window.electronAPI?.setIgnoreMouse(false)}
                        onMouseLeave={() => window.electronAPI?.setIgnoreMouse(true)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    >
                        <div className="p-3 overflow-y-auto max-h-64 space-y-2">
                            {(messages || []).map((m, i) => (
                                <motion.div
                                    key={i}
                                    className={`p-2 rounded-xl max-w-[80%] ${
                                        m.from === 'user'
                                            ? 'bg-blue-200 self-end text-right'
                                            : 'bg-gray-200 self-start text-left'
                                    }`}
                                    initial={{ opacity: 0, x: m.from === 'user' ? 50 : -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                                >
                                    {m.text}
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex border-t p-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Напиши что-нибудь..."
                                className="flex-1 p-2 rounded-lg border border-gray-300"
                            />
                            <button
                                onClick={handleSend}
                                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95"
                            >
                                Отправить
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default App
