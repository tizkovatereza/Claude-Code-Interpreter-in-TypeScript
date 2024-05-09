# Claude-Code-Interpreter-in-TypeScript


### Techstack
- E2B Code Interpreter SDK
- Claude by Anthropic
- JavaScript/TypeScript


### How to run the program
- Prerequisites
  - E2B API KEY
  - ANTHROPIC API KEY

- Install packages


# Guide

## 1. Initialize a new Node.js project:
Open your terminal or command prompt in the directory where you want your project to be, and run:

` npm init -y `

This will create a package.json file and you will see the following output in terminal:

Wrote to /Users/terezatizkova/Developer/Claude-Code-Interpreter-in-TypeScript/package.json:

```
{
  "name": "claude-code-interpreter-in-typescript",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Install TypeScript and Axios:

` npm install typescript axios @types/node @types/axios --save `

Create a TypeScript configuration file:

` npx tsc --init `

This will create tsconfig.json file.

Install dotenv for accessing environment variables.

` npm install dotenv `.

Install Antrhopic AI SDK:

` npm install @anthropic-ai/sdk `

and E2B Code Interpreter SDK:


```npm init -y \ 
&& npm i --save-dev typescript tsx @types/node \
&& npm i @e2b/code-interpreter
```


## 2. Create TypeScript file

```
import axios from 'axios';

// Define the API key and endpoint
const API_KEY = 'your_anthropic_api_key';
const ENDPOINT = 'https://api.anthropic.com/your_endpoint';

// Function to make an API call
async function callAnthropicAPI() {
    try {
        const response = await axios.post(ENDPOINT, {
            // your API request payload here
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('API Response:', response.data);
    } catch (error) {
        console.error('API Call Failed:', error);
    }
}

// Call the function
callAnthropicAPI();
```

## 3. Compile and run your TypeScript program:
Modify your package.json to add a script for running the TypeScript compiler and executing your code:

```
"scripts": {
    "start": "tsc && node app.js"
}
```

## 4. Run the program.

Then, you can run your program using:

` npm start `

When you do it, the TypeScript program app.ts compiles to JavaScript and creates new file app.js.