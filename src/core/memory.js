import fs from 'fs'
import path from 'path'

export class MemorySystem {
  constructor() {
    this.tempMemory = []; 
    this.additionalNote = {};
  }

  getContext(limit = 100) {
    return this.tempMemory
      .filter((msg) => msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system')
      .slice(-limit * 2)
  }

  getAdditionalNote() {
    return this.additionalNote.toString()
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
    this.tempMemory = [
      ...this.tempMemory.slice(-199),
      {
        role: 'system',
        content: `Имя пользователя: ${username}`
      },
      { role: 'user', content: userMessage, username },
      { role: 'assistant', content: aiResponse }
    ]

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
