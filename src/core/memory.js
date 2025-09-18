import fs from 'fs'
import path from 'path'

export class MemorySystem {
    constructor() {
        this.tempMemory = []
        this.additionalNote = {}
    }

    getContext(limit = 100) {
        return this.tempMemory
            .filter(
                (msg) => msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system'
            )
            .slice(-limit * 2)
    }

    getAdditionalNote() {
        return this.additionalNote
    }

    setNote(name, newPrompt) {
        this.additionalNote[name] = newPrompt
    }

    unsetNote(name) {
        if (this.additionalNote.hasOwnProperty(name)) {
            delete this.additionalNote[name]
            return true
        }
        return false
    }

    updateMemory(userMessage, aiResponse) {
        console.log(this.getContext())
        this.tempMemory = [
            ...this.tempMemory.slice(-199),
            { role: 'user', content: userMessage },
            { role: 'assistant', content: aiResponse }
        ]

        // Затычка
        const importance = 0
        //
        if (importance > 0.65) {
            this.permMemory.facts.push(`${userMessage} → ${aiResponse}`)
            this.savePermanentMemory()
        }
    }

    loadPermanentMemory() {
        try {
            return JSON.parse(fs.readFileSync(this.MEMORY_FILE, 'utf-8'))
        } catch {
            return { keywords: [], facts: [] }
        }
    }

    savePermanentMemory() {
        fs.writeFileSync(this.MEMORY_FILE, JSON.stringify(this.permMemory, null, 2))
    }
}
