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
///////////////////////// TBD - update this:
// Initialize Anthropic client
const anthropic = new sdk_1.Anthropic({
    apiKey: ANTHROPIC_API_KEY,
});
// Placeholder for E2B Code Interpreter functionality
// You need to replace this with actual E2B SDK initialization if available
class codeInterpreter {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    execCell(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // Simulate sending code to the E2B sandbox
            console.log("Executing code in the E2B sandbox:", code);
            // Placeholder for actual API call
            return { result: "Result of executing the provided code", error: null };
        });
    }
}
// Function to process messages with tool invocation
function processMessageWithTools(inputText) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield anthropic.beta.tools.messages.create({
                model: MODEL_NAME,
                messages: [{ role: 'user', content: inputText }],
                max_tokens: 1024,
            });
            // Simulate tool use response and action
            if (response.stop_reason === "tool_use") {
                const toolCode = `Your Python code to execute based on the model's response`;
                const execResult = yield codeInterpreter.execCell(toolCode);
                console.log("Tool Execution Result:", execResult);
            }
            console.log('Response from Anthropic:', response);
        }
        catch (error) {
            console.error('Error processing message with tools:', error);
        }
    });
}
// Example usage
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const userMessage = 'Calculate value of pi using monte carlo method. Use 1000 iterations.';
        yield processMessageWithTools(userMessage);
    });
}
main();
