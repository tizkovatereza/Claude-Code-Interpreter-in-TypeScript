// Import necessary libraries and SDKs
import { Anthropic } from '@anthropic-ai/sdk';
import { CodeInterpreter } from '@e2b/code-interpreter';
import * as dotenv from 'dotenv';
import { ProcessMessage } from '@e2b/code-interpreter';
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
            "type": "object",  // Correct type
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

async function codeInterpret(codeInterpreter: CodeInterpreter, code: string) {
    console.log("Running code interpreter...");

    try {
        const exec = await codeInterpreter.notebook.execCell(code, {
            onStderr: (msg: ProcessMessage) => console.log("[Code Interpreter stderr]", msg),
            onStdout: (stdout: ProcessMessage) => console.log("[Code Interpreter stdout]", stdout),
        });

        if (exec.error) {
            console.log("[Code Interpreter ERROR]", exec.error);
            return [];
        }

        return exec.results || [];  // Ensure that 'results' is the correct property and always return an array
    } catch (error) {
        console.error("Error during code execution:", error);
        return [];
    }
}

const client = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
});

async function processToolCall(codeInterpreter: CodeInterpreter, toolName: string, toolInput: any): Promise<any[]> {
    if (toolName === "execute_python") {
        return await codeInterpret(codeInterpreter, toolInput["code"]);
    }
    return [];
}

async function chatWithClaude(codeInterpreter: CodeInterpreter, userMessage: string) {
    console.log(`\n${'='.repeat(50)}\nUser Message: ${userMessage}\n${'='.repeat(50)}`);

    const message = await client.beta.tools.messages.create({
        model: MODEL_NAME,
        system: SYSTEM_PROMPT,
        max_tokens: 4096,
        messages: [{ role: "user", content: userMessage }],
        tools: tools as any,  // Casting to '
    })
