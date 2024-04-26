import { Lexer } from "./lexer/lexer"
import { TokenType } from "./lexer/token"

const src = `var x = 10;
var y = 20;
var z = x + y;
print(z);
for (var i = 0; i < 10; i++) {
    print(i);
}`

var lexer = new Lexer(src, "/")

while (true) {
    var token = lexer.nextToken()
    if (token.type == TokenType.EndOfFile) {
        break
    }
    console.log(token)
}
