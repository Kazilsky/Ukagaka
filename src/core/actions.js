import { MemorySystem } from './memory'
export class AIActionHandler {
    constructor(memory) {
        this.memory = new MemorySystem()
        // this.EmoteSwap = EmoteSwap
    }

    async execute(action, params) {
        switch (action) {
            case 'log':
                return this.handleLog(params)

            // Работа с записями
            case 'noteSet':
                return this.handleNoteSet(params)
            case 'noteUnset':
                return this.handleNoteUnset(params)

            case 'emoteSet':
                return this.handleEmoteSet(params)

            default:
                throw new Error(`Unknown action: ${action}`)
        }
    }

    /**
     * Отвечает за вывод логов в консоль самим чарактером
     * @param {params.message}
     * @returns
     */
    handleLog(params) {
        console.log(`[AI LOG] ${params.message}`)
        return { success: true }
    }

    /**
     * Отвечает за создание или редактирование уже готовых заметок самим чарактером
     * @param {name, message, prompt} param
     * @returns
     */
    handleNoteSet(params) {
        this.memory.setNote(params.name, params.prompt)
        console.log(`[AI NOTE.SET] ${params.name}: ${params.message || 'Prompt updated'}`)
        return { success: true }
    }

    /**
     * Отвечает за удаление уже готовых заметок самим чарактером
     * @param {name, message, prompt} param
     * @returns
     */
    handleNoteUnset(params) {
        this.memory.unsetNote(params.name)
        console.log(`[AI NOTE.UNSET] ${params.name} || "Prompt updated"}`)
        return { success: true }
    }

    /**
     * Отвечает за переключение спрайтов самим чарактером
     * @param {EmoteName} params
     * @returns
     */
    handleEmoteSet(params) {
        console.log(`[AI EMOTE.SET] ${params.name} || "Prompt updated"}`)
        return { success: true }
    }
}
