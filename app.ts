// Import necessary libraries and SDKs
import { Anthropic } from '@anthropic-ai/sdk';
import { CodeInterpreter } from '@e2b/code-interpreter'
import * as dotenv from 'dotenv';
dotenv.config();

// Constants: API Keys, Model Name, and system prompt
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const E2B_API_KEY = process.env.E2B_API_KEY;
const MODEL_NAME = 'claude-3-opus-20240229';

const SYSTEM_PROMPT = `
## your job & context
you are a python data scientist. you are given tasks to complete and you run python code to solve them.
- the python code runs in jupyter notebook.
- every time you call \`execute_python\` tool, the python code is executed in a separate cell. it's okay to multiple calls to \`execute_python\`.
- display visualizations using matplotlib or any other visualization library directly in the notebook. don't worry about saving the visualizations to a file.
- you have access to the internet and can make api requests.
- you also have access to the filesystem and can read/write files.
- you can install any pip package (if it exists) if you need to but the usual packages for data analysis are already preinstalled.
- you can run any python code you want, everything is running in a secure sandbox environment.

## style guide
tool response values that have text inside "[]"  mean that a visual element got rendered in the notebook. for example:
- "[chart]" means that a chart was generated in the notebook.
`;

const tools = [
    {
        "name": "execute_python",
        "description": "Execute python code in a Jupyter notebook cell and returns any result, stdout, stderr, display_data, and error.",
        "input_schema": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string",
                    "description": "The python code to execute in a single cell."
                }
            },
            "required": ["code"]
        }
    }
];

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
