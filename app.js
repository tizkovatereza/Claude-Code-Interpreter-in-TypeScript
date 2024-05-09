"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Define the API key and endpoint
const API_KEY = 'your_anthropic_api_key';
const ENDPOINT = 'https://api.anthropic.com/your_endpoint';
// Function to make an API call
function callAnthropicAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(ENDPOINT, {
            // your API request payload here
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('API Response:', response.data);
        }
        catch (error) {
            console.error('API Call Failed:', error);
        }
    });
}
// Call the function
callAnthropicAPI();
