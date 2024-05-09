"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary libraries and SDKs
const sdk_1 = require("@anthropic-ai/sdk");
const code_interpreter_1 = require("@e2b/code-interpreter");
const dotenv = __importStar(require("dotenv"));
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
function codeInterpret(codeInterpreter, code) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running code interpreter...");
        try {
            const exec = yield codeInterpreter.notebook.execCell(code, {
                onStderr: (msg) => console.log("[Code Interpreter stderr]", msg),
                onStdout: (stdout) => console.log("[Code Interpreter stdout]", stdout),
                // You can also stream additional results like charts, images, etc.
                // onResult: ...
            });
            if (exec.error) {
                console.log("[Code Interpreter ERROR]", exec.error);
                return undefined;
            }
            return exec.results; // Ensure that 'results' is the correct property
        }
        catch (error) {
            console.error("Error during code execution:", error);
            return undefined;
        }
    });
}
const client = new sdk_1.Anthropic({
    apiKey: ANTHROPIC_API_KEY,
});
function processToolCall(codeInterpreter, toolName, toolInput) {
    return __awaiter(this, void 0, void 0, function* () {
        if (toolName === "execute_python") {
            return yield codeInterpret(codeInterpreter, toolInput["code"]);
        }
        return [];
    });
}
function chatWithClaude(codeInterpreter, userMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`\n${'='.repeat(50)}\nUser Message: ${userMessage}\n${'='.repeat(50)}`);
        const message = yield client.beta.tools.messages.create({
            model: MODEL_NAME,
            system: SYSTEM_PROMPT,
            max_tokens: 4096,
            messages: [{ role: "user", content: userMessage }],
            tools: tools,
        });
        console.log(`\nInitial Response:\nStop Reason: ${message.stop_reason}\nContent: ${message.content}`);
        if (message.stop_reason === "tool_use") {
            const toolUse = message.content.find(block => block.type === "tool_use");
            const toolName = toolUse.name;
            const toolInput = toolUse.input;
            console.log(`\nTool Used: ${toolName}\nTool Input: ${JSON.stringify(toolInput)}`);
            const codeInterpreterResults = yield processToolCall(codeInterpreter, toolName, toolInput);
            console.log(`Tool Result: ${codeInterpreterResults}`);
            return codeInterpreterResults;
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const codeInterpreter = new code_interpreter_1.CodeInterpreter({ apiKey: E2B_API_KEY });
        try {
            const codeInterpreterResults = yield chatWithClaude(codeInterpreter, "Calculate value of pi using monte carlo method. Use 1000 iterations. Visualize all point of all iterations on a single plot, a point inside the unit circle should be green, other points should be gray.");
            const result = codeInterpreterResults[0];
            console.log(result);
            // This would display or process the image/result if applicable
            // You might need additional logic here to handle images or other outputs
        }
        catch (error) {
            console.error('An error occurred:', error);
        }
    });
}
main();
///////////////////////// TBD - probably delete this
// // Initialize Anthropic client
// const anthropic = new Anthropic({
//     apiKey: ANTHROPIC_API_KEY,
// });
// // Function to process messages with tool invocation
// async function processMessageWithTools(inputText: string) {
//     try {
//         const response = await anthropic.beta.tools.messages.create({
//             model: MODEL_NAME,
//             messages: [{ role: 'user', content: inputText }],
//             max_tokens: 1024,
//         });
//         // Simulate tool use response and action
//         if (response.stop_reason === "tool_use") {
//             const toolCode = `Your Python code to execute based on the model's response`;
//             const execResult = await codeInterpreter.execCell(toolCode);
//             console.log("Tool Execution Result:", execResult);
//         }
//         console.log('Response from Anthropic:', response);
//     } catch (error) {
//         console.error('Error processing message with tools:', error);
//     }
// }
// // Example usage
// async function main() {
//     const userMessage = 'Calculate value of pi using monte carlo method. Use 1000 iterations.';
//     await processMessageWithTools(userMessage);
// }
// main();
