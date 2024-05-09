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
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeInterpret = void 0;
function codeInterpret(codeInterpreter, code) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`\n${'='.repeat(50)}\n> Running following AI-generated code:\n${code}\n${'='.repeat(50)}`);
        const exec = yield codeInterpreter.notebook.execCell(code, {
        // You can stream logs from the code interpreter
        // onStderr: (stderr: string) => console.log("\n[Code Interpreter stdout]", stderr),
        // onStdout: (stdout: string) => console.log("\n[Code Interpreter stderr]", stdout),
        //
        // You can also stream additional results like charts, images, etc.
        // onResult: ...
        });
        if (exec.error) {
            console.log('[Code Interpreter error]', exec.error); // Runtime error
            return undefined;
        }
        return exec;
    });
}
exports.codeInterpret = codeInterpret;
