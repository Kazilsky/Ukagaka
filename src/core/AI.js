import { MemorySystem } from "./memory.js";
import { PromptSystem } from "./prompts.js";
import 'dotenv/config'

export class ApiNeiro {
  constructor() {
    this.memory = new MemorySystem();
    this.promptSystem = new PromptSystem(this.memory);
    // this.actionHandler = new AIActionHandler(); // раскомментируйте когда добавите
  }

  async generateResponse(message) {
    const messages = this.promptSystem.buildMessages(message);
    const response = await this.queryAI(messages);
    // Заполняем память
    // this.memory.updateMemory(params.channelId, params.message, response, 0, params.user.username);
    return this.processResponse(response);
  }

  async queryAI(messages) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-nano-9b-v2:free',
        messages,
        temperature: 0.6
      })
    }).catch();

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async processResponse(response) {
    const actionRegex = /\[AI_ACTION:(\w+)\](.*?)\[\/AI_ACTION\]/gs;
    let processedResponse = response;

    // Временно закомментируйте обработку действий, пока не добавите actionHandler
    /*
    for (const match of response.matchAll(actionRegex)) {
      try {
        const result = await this.actionHandler.execute(match[1], JSON.parse(match[2]));
        processedResponse = processedResponse.replace(
          match[0],
          `[${match[1]}: ${result.success ? '✓' : '✗'}]`
        );
      } catch (error) {
        console.error('Action processing error:', error);
      }
    }
    */

    return processedResponse;
  }
}


let AIInstance = new ApiNeiro()
export default AIInstance;