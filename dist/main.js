"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer/lexer");
const token_1 = require("./lexer/token");
const src = `var x = 10;
var y = 20;
var z = x + y;
print(z);
for (var i = 0; i < 10; i++) {
    print(i);
}`;
var lexer = new lexer_1.Lexer(src, "/");
while (true) {
    var token = lexer.nextToken();
    if (token.type == token_1.TokenType.EndOfFile) {
        break;
    }
    console.log(token);
}
