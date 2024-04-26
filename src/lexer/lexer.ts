import { Token, TokenType } from "./token"

const keywords: Map<string, TokenType> = new Map([
    ["import", TokenType.Import],
    ["true", TokenType.True],
    ["false", TokenType.False],
    ["nil", TokenType.Nil],
    ["var", TokenType.Var],
    ["const", TokenType.Const],
    ["func", TokenType.Func],
    ["if", TokenType.If],
    ["elif", TokenType.Elif],
    ["else", TokenType.Else],
    ["for", TokenType.For],
    ["while", TokenType.While],
    ["break", TokenType.Break],
    ["continue", TokenType.Continue],
    ["return", TokenType.Return],
    ["struct", TokenType.Struct],
    ["public", TokenType.Public],
    ["private", TokenType.Private],
    ["int", TokenType.Int],
    ["float", TokenType.Float],
    ["string", TokenType.String],
    ["bool", TokenType.Bool],
    ["void", TokenType.Void],
    ["char", TokenType.Char],
])

const operators: Map<string, TokenType> = new Map([
    ["+", TokenType.Add],
    ["-", TokenType.Minus],
    ["*", TokenType.Mul],
    ["/", TokenType.Div],
    ["%", TokenType.Mod],
    ["=", TokenType.Assign],
    ["==", TokenType.Equal],
    ["!=", TokenType.NotEqual],
    [">", TokenType.GreaterThan],
    [">=", TokenType.GreaterEqual],
    ["<", TokenType.LessThan],
    ["<=", TokenType.LessEqual],
    ["&&", TokenType.And],
    ["||", TokenType.Or],
    ["!", TokenType.Not],
    ["&", TokenType.BAnd],
    ["|", TokenType.BOr],
    ["^", TokenType.BXor],
    ["<<", TokenType.LMove],
    [">>", TokenType.RMove],
    ["++", TokenType.Increment],
    ["--", TokenType.Decrement],
    [",", TokenType.Comma],
    [";", TokenType.Semicolon],
    [":", TokenType.Colon],
    ["{", TokenType.LBrace],
    ["}", TokenType.RBrace],
    ["[", TokenType.LBracket],
    ["]", TokenType.RBracket],
    ["(", TokenType.LParen],
    [")", TokenType.RParen],
    [".", TokenType.Dot],
])

export class Lexer {
    private file: string
    private src: string
    private line: number
    private column: number
    private pos: number

    constructor(src: string, file: string) {
        this.file = file
        this.src = src
        this.line = 1
        this.column = 1
        this.pos = 0
    }

    nextToken(): Token {
        this.skipWhitespace()
        if (this.pos >= this.src.length) {
            return this.newToken(TokenType.EndOfFile)
        }
        if (operators.has(this.src[this.pos])) {
            if (operators.has(this.src.substring(this.pos, this.pos + 2))) {
                const op = this.next(2)
                return this.newToken(operators.get(op)!)
            } else {
                const op = this.next()
                return this.newToken(operators.get(op)!)
            }
        }
        if (isLetter(this.src[this.pos])) {
            return this.scanIdentifier()
        }
        if (isDigit(this.src[this.pos])) {
            return this.scanNumber()
        }
        if (this.src[this.pos] == '"') {
            return this.scanString()
        }
        if (this.src[this.pos] == "'") {
            return this.scanChar()
        }
        return this.newToken(TokenType.Unknown)
    }

    private scanString(): Token {
        let result = ""
        this.next()
        while (this.src[this.pos] != '"') {
            if (this.src[this.pos] == "\\") {
                this.next()
                if (this.src[this.pos] == "n") {
                    result += "\n"
                } else if (this.src[this.pos] == "t") {
                    result += "\t"
                } else if (this.src[this.pos] == "r") {
                    result += "\r"
                } else if (this.src[this.pos] == "b") {
                    result += "\b"
                } else if (this.src[this.pos] == "f") {
                    result += "\f"
                } else if (this.src[this.pos] == '"') {
                    result += '"'
                } else if (this.src[this.pos] == "\\") {
                    result += "\\"
                } else {
                    result += this.src[this.pos]
                }
            } else {
                result += this.next()
            }
        }
        this.next()
        return this.newToken(TokenType.String, result)
    }

    private scanChar(): Token {
        this.next()
        let ch = this.next()
        if (ch == "\\") {
            ch = this.next()
            if (ch == "n") {
                ch = "\n"
            } else if (ch == "t") {
                ch = "\t"
            } else if (ch == "r") {
                ch = "\r"
            } else if (ch == "b") {
                ch = "\b"
            } else if (ch == "f") {
                ch = "\f"
            } else if (ch == "'") {
                ch = "'"
            } else if (ch == "\\") {
                ch = "\\"
            } else {
                ch = this.src[this.pos]
            }
        }
        if (this.src[this.pos] != "'") {
            return this.newToken(TokenType.Unknown)
        }
        this.next()
        return this.newToken(TokenType.Char, ch)
    }

    private scanNumber(): Token {
        let result = ""
        let dotCount = 0
        while (isDigit(this.src[this.pos]) || this.src[this.pos] == ".") {
            if (this.src[this.pos] == ".") {
                dotCount += 1
                if (dotCount > 1) {
                    break
                }
            }
            result += this.next()
        }
        if (dotCount == 0) {
            return this.newToken(TokenType.Int, result)
        } else {
            return this.newToken(TokenType.Float, result)
        }
    }

    private scanIdentifier(): Token {
        let result = ""
        while (isLetter(this.src[this.pos])) {
            result += this.next()
        }

        if (keywords.has(result)) {
            return this.newToken(keywords.get(result)!)
        } else {
            return this.newToken(TokenType.Identifier, result)
        }
    }

    private skipWhitespace(): void {
        while (
            isWhitespace(this.src[this.pos]) ||
            this.test("//") ||
            this.test("/*")
        ) {
            if (this.src[this.pos] == "\n") {
                this.line += 1
                this.column = 1
            } else if (this.test("//") || this.test("/*")) {
                this.skipComment()
            } else {
                this.column += 1
            }
            this.pos += 1
        }
    }

    private skipComment(): void {
        if (this.test("/*")) {
            this.pos += 2
            while (!this.test("*/")) {
                if (this.src[this.pos] == "\n") {
                    this.line += 1
                    this.column = 1
                } else {
                    this.column += 1
                }
                this.pos += 1
            }
            this.pos += 2
        } else if (this.test("//")) {
            while (this.src[this.pos] != "\n") {
                this.pos += 1
            }
            this.line += 1
            this.column = 1
            this.pos += 1
        }
    }

    private next(n: number = 1): string {
        const result = this.src.slice(this.pos, this.pos + n)
        this.pos += n
        this.column += n
        return result
    }

    private test(ch: string): boolean {
        return this.src.slice(this.pos, this.pos + ch.length) == ch
    }

    private newToken(type: TokenType, literal: string = ""): Token {
        return {
            type: type,
            literal: literal,
            line: this.line,
            column: this.column,
            file: this.file,
        }
    }
}

function isDigit(ch: string): boolean {
    return /[0-9]/.test(ch)
}

function isLetter(ch: string): boolean {
    return /[a-zA-Z_]/.test(ch)
}

function isWhitespace(ch: string): boolean {
    return /\s/.test(ch)
}
