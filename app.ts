// Import necessary libraries
import axios from 'axios';
import { Anthropic } from '@anthropic-ai/sdk';

// Constants: API Keys and Model Name

import * as dotenv from 'dotenv';
dotenv.config();


const E2B_API_KEY = process.env.E2B_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL_NAME = 'claude-3-opus-20240229';

// Define the system prompt
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
tool response values that have text inside "[]"  mean that a visual element got rended in the notebook. for example:
- "[chart]" means that a chart was generated in the notebook.
`;


const anthropic = new Anthropic({
    apiKey: 'ANTHROPIC_API_KEY',  // Replace 'Your_API_Key' with your actual API key
});


async function sendMessageToAnthropic(inputText: string) {
    try {
        const response = await anthropic.beta.tools.messages.create({
            max_tokens: 1024,
            messages: [{ role: 'user', content: inputText }],
            model: 'claude-3-opus-20240229',  // Ensure this is the correct model name
        });
        
        console.log('Response from Anthropic:', response);
    } catch (error) {
        console.error('Error calling the Anthropic API:', error);
    }
}



// TBD - fix this.  This is probably redundant and is wrong call to Anthropic.
const axiosInstance = axios.create({
    baseURL: 'https://api.anthropic.com',
    headers: {
        'Authorization': `Bearer ${ANTHROPIC_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

// Function to create messages using Anthropic API
async function createMessage(userMessage: string) {
    try {
        const response = await axiosInstance.post('/messages', {
            model: MODEL_NAME,
            system: SYSTEM_PROMPT,
            max_tokens: 4096,
            messages: [{ role: "user", content: userMessage }]
        });
        return response.data;
    } catch (error) {
        console.error('Error calling the Anthropic API:', error);
        return null;
    }
}

// Example usage
async function main() {
    const userMessage = 'Calculate value of pi using monte carlo method. Use 1000 iterations.';
    const response = await createMessage(userMessage);
    console.log('API Response:', response);
}

main();
