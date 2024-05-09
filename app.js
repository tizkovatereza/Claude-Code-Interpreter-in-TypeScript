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
            "type": "object", // Correct type
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
            });
            if (exec.error) {
                console.log("[Code Interpreter ERROR]", exec.error);
                return [];
            }
            return exec.results || []; // Ensure that 'results' is the correct property and always return an array
        }
        catch (error) {
            console.error("Error during code execution:", error);
            return [];
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
            tools: tools, // Casting to '
        });
    });
}
