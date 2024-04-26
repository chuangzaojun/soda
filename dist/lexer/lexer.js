"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const token_1 = require("./token");
const keywords = new Map([
    ["import", token_1.TokenType.Import],
    ["true", token_1.TokenType.True],
    ["false", token_1.TokenType.False],
    ["nil", token_1.TokenType.Nil],
    ["var", token_1.TokenType.Var],
    ["const", token_1.TokenType.Const],
    ["func", token_1.TokenType.Func],
    ["if", token_1.TokenType.If],
    ["elif", token_1.TokenType.Elif],
    ["else", token_1.TokenType.Else],
    ["for", token_1.TokenType.For],
    ["while", token_1.TokenType.While],
    ["break", token_1.TokenType.Break],
    ["continue", token_1.TokenType.Continue],
    ["return", token_1.TokenType.Return],
    ["struct", token_1.TokenType.Struct],
    ["public", token_1.TokenType.Public],
    ["private", token_1.TokenType.Private],
    ["int", token_1.TokenType.Int],
    ["float", token_1.TokenType.Float],
    ["string", token_1.TokenType.String],
    ["bool", token_1.TokenType.Bool],
    ["void", token_1.TokenType.Void],
    ["char", token_1.TokenType.Char],
]);
const operators = new Map([
    ["+", token_1.TokenType.Add],
    ["-", token_1.TokenType.Minus],
    ["*", token_1.TokenType.Mul],
    ["/", token_1.TokenType.Div],
    ["%", token_1.TokenType.Mod],
    ["=", token_1.TokenType.Assign],
    ["==", token_1.TokenType.Equal],
    ["!=", token_1.TokenType.NotEqual],
    [">", token_1.TokenType.GreaterThan],
    [">=", token_1.TokenType.GreaterEqual],
    ["<", token_1.TokenType.LessThan],
    ["<=", token_1.TokenType.LessEqual],
    ["&&", token_1.TokenType.And],
    ["||", token_1.TokenType.Or],
    ["!", token_1.TokenType.Not],
    ["&", token_1.TokenType.BAnd],
    ["|", token_1.TokenType.BOr],
    ["^", token_1.TokenType.BXor],
    ["<<", token_1.TokenType.LMove],
    [">>", token_1.TokenType.RMove],
    ["++", token_1.TokenType.Increment],
    ["--", token_1.TokenType.Decrement],
    [",", token_1.TokenType.Comma],
    [";", token_1.TokenType.Semicolon],
    [":", token_1.TokenType.Colon],
    ["{", token_1.TokenType.LBrace],
    ["}", token_1.TokenType.RBrace],
    ["[", token_1.TokenType.LBracket],
    ["]", token_1.TokenType.RBracket],
    ["(", token_1.TokenType.LParen],
    [")", token_1.TokenType.RParen],
    [".", token_1.TokenType.Dot],
]);
class Lexer {
    constructor(file, src) {
        this.file = file;
        this.src = src;
        this.line = 1;
        this.column = 1;
        this.pos = 0;
    }
    nextToken() {
        this.skipWhitespace();
        if (this.pos >= this.src.length) {
            return this.newToken(token_1.TokenType.EndOfFile);
        }
        if (operators.has(this.src.slice(this.pos))) {
            if (operators.has(this.src.slice(this.pos, this.pos + 2))) {
                const op = this.next(2);
                return this.newToken(operators.get(op));
            }
            else {
                const op = this.next();
                return this.newToken(operators.get(op));
            }
        }
        if (isLetter(this.src[this.pos])) {
            return this.scanIdentifier();
        }
        if (isDigit(this.src[this.pos])) {
            return this.scanNumber();
        }
        if (this.src[this.pos] == '"') {
            return this.scanString();
        }
        if (this.src[this.pos] == "'") {
            return this.scanChar();
        }
        return this.newToken(token_1.TokenType.Unknown);
    }
    scanString() {
        let result = "";
        this.next();
        while (this.src[this.pos] != '"') {
            if (this.src[this.pos] == "\\") {
                this.next();
                if (this.src[this.pos] == "n") {
                    result += "\n";
                }
                else if (this.src[this.pos] == "t") {
                    result += "\t";
                }
                else if (this.src[this.pos] == "r") {
                    result += "\r";
                }
                else if (this.src[this.pos] == "b") {
                    result += "\b";
                }
                else if (this.src[this.pos] == "f") {
                    result += "\f";
                }
                else if (this.src[this.pos] == '"') {
                    result += '"';
                }
                else if (this.src[this.pos] == "\\") {
                    result += "\\";
                }
                else {
                    result += this.src[this.pos];
                }
            }
            else {
                result += this.next();
            }
        }
        this.next();
        return this.newToken(token_1.TokenType.String, result);
    }
    scanChar() {
        this.next();
        let ch = this.next();
        if (ch == "\\") {
            ch = this.next();
            if (ch == "n") {
                ch = "\n";
            }
            else if (ch == "t") {
                ch = "\t";
            }
            else if (ch == "r") {
                ch = "\r";
            }
            else if (ch == "b") {
                ch = "\b";
            }
            else if (ch == "f") {
                ch = "\f";
            }
            else if (ch == "'") {
                ch = "'";
            }
            else if (ch == "\\") {
                ch = "\\";
            }
            else {
                ch = this.src[this.pos];
            }
        }
        if (this.src[this.pos] != "'") {
            return this.newToken(token_1.TokenType.Unknown);
        }
        this.next();
        return this.newToken(token_1.TokenType.Char, ch);
    }
    scanNumber() {
        let result = "";
        let dotCount = 0;
        while (isDigit(this.src[this.pos]) || this.src[this.pos] == ".") {
            if (this.src[this.pos] == ".") {
                dotCount += 1;
                if (dotCount > 1) {
                    break;
                }
            }
            result += this.next();
        }
        if (dotCount == 0) {
            return this.newToken(token_1.TokenType.Int, result);
        }
        else {
            return this.newToken(token_1.TokenType.Float, result);
        }
    }
    scanIdentifier() {
        let result = "";
        while (isLetter(this.src[this.pos])) {
            result += this.next();
        }
        if (keywords.has(result)) {
            return this.newToken(keywords.get(result), result);
        }
        else {
            return this.newToken(token_1.TokenType.Identifier, result);
        }
    }
    skipWhitespace() {
        while (isWhitespace(this.src[this.pos]) ||
            this.test("//") ||
            this.test("/*")) {
            if (this.src[this.pos] == "\n") {
                this.line += 1;
                this.column = 1;
            }
            else if (this.test("//") || this.test("/*")) {
                this.skipComment();
            }
            else {
                this.column += 1;
            }
            this.pos += 1;
        }
    }
    skipComment() {
        if (this.test("/*")) {
            this.pos += 2;
            while (!this.test("*/")) {
                if (this.src[this.pos] == "\n") {
                    this.line += 1;
                    this.column = 1;
                }
                else {
                    this.column += 1;
                }
                this.pos += 1;
            }
            this.pos += 2;
        }
        else if (this.test("//")) {
            while (this.src[this.pos] != "\n") {
                this.pos += 1;
            }
            this.line += 1;
            this.column = 1;
            this.pos += 1;
        }
    }
    next(n = 1) {
        const result = this.src.slice(this.pos, this.pos + n);
        this.pos += n;
        this.column += n;
        return result;
    }
    test(ch) {
        return this.src.slice(this.pos, this.pos + ch.length) == ch;
    }
    newToken(type, literal = "") {
        return {
            type: type,
            literal: literal,
            line: this.line,
            column: this.column,
            file: this.file,
        };
    }
}
exports.Lexer = Lexer;
function isDigit(ch) {
    return /[0-9]/.test(ch);
}
function isLetter(ch) {
    return /[a-zA-Z_]/.test(ch);
}
function isWhitespace(ch) {
    return /\s/.test(ch);
}
