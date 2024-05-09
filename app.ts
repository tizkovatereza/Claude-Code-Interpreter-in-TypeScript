// Import necessary libraries and SDKs
import { Anthropic } from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';
dotenv.config();

// Constants: API Keys, Model Name, and system prompt
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const E2B_API_KEY = process.env.E2B_API_KEY;
const MODEL_NAME = 'claude-3-opus-20240229';

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
});

// Placeholder for E2B Code Interpreter functionality
// You need to replace this with actual E2B SDK initialization if available
class codeInterpreter {
    apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async execCell(code: string): Promise<any> {
        // Simulate sending code to the E2B sandbox
        console.log("Executing code in the E2B sandbox:", code);
        // Placeholder for actual API call
        return { result: "Result of executing the provided code", error: null };
    }
}

// Initialize E2B Code Interpreter
export async function codeInterpret(codeInterpreter: codeInterpreter, code: string) {
    console.log(`\n${'='.repeat(50)}\n> Running following AI-generated code:\n${code}\n${'='.repeat(50)}`);

    const exec = await codeInterpreter.execCell(code);
    
    if (exec.error) {
        console.log('[Code Interpreter error]', exec.error) // Runtime error
        return undefined
    }
    
    return exec
}

// Function to process messages with tool invocation
async function processMessageWithTools(inputText: string) {
    try {
        const response = await anthropic.beta.tools.messages.create({
            model: MODEL_NAME,
            messages: [{ role: 'user', content: inputText }],
            max_tokens: 1024,
        });

        // Simulate tool use response and action
        if (response.stop_reason === "tool_use") {
            const toolCode = `Your Python code to execute based on the model's response`;
            const execResult = await codeInterpreter.execCell(toolCode);
            console.log("Tool Execution Result:", execResult);
        }

        console.log('Response from Anthropic:', response);
    } catch (error) {
        console.error('Error processing message with tools:', error);
    }
}

// Example usage
async function main() {
    const userMessage = 'Calculate value of pi using monte carlo method. Use 1000 iterations.';
    await processMessageWithTools(userMessage);
}

main();
