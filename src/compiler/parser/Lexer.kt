package compiler.parser

class Lexer(private val src: String, private val file: String) {
    private var pos: Int = 0
    private var ln: Int = 1
    private var col: Int = 1

    fun nextToken(): Token {
        skipWhitespace()
        if (pos >= src.length) {
            return Token(TokenType.EndOfFile, "", ln, col, file)
        }
        if (operators.containsKey(src.substring(pos, pos + 1))) {
            if (operators.containsKey(src.substring(pos, pos + 2))) {
                val op = next(2)
                val tokenType = operators[op] ?: TokenType.Unknown
                return Token(tokenType, op, ln, col, file)
            } else {
                val op = next(1)
                val tokenType = operators[op] ?: TokenType.Unknown
                return Token(tokenType, op, ln, col, file)
            }
        }
        if (isLetter(src[pos])) {
            return scanIdentifier()
        }
        if (isDigit(src[pos])) {
            return scanNumber()
        }
        if (src[pos] == '"') {
            return scanString()
        }
        if (src[pos] == '\'') {
            return scanChar()
        }
        return Token(TokenType.Unknown, "", ln, col, file)
    }

    private fun scanChar(): Token {
        next()
        var ch = next()
        if (ch == "\\") {
            ch = next()
            if (ch == "n") {
                ch = "\n"
            } else if (ch == "t") {
                ch = "\t"
            } else if (ch == "r") {
                ch = "\r"
            } else if (ch == "b") {
                ch = "\b"
            } else if (ch == "'") {
                ch = "'"
            } else if (ch == "\\") {
                ch = "\\"
            } else {
                ch = src.substring(pos, pos + 1)
            }
        }
        if (src[pos] != '\'') {
            return Token(TokenType.Unknown, "", ln, col, file)
        }
        next()
        return Token(TokenType.CharLiteral, ch, ln, col, file)
    }

    private fun scanString(): Token {
        var result = ""
        next()
        while (src[pos] != '"') {
            if (src[pos] == '\\') {
                next()
                if (src[pos] == 'n') {
                    result += "\n"
                } else if (src[pos] == 't') {
                    result += "\t"
                } else if (src[pos] == 'r') {
                    result += "\r"
                } else if (src[pos] == 'b') {
                    result += "\b"
                } else if (src[pos] == '"') {
                    result += '"'
                } else if (src[pos] == '\\') {
                    result += "\\"
                } else {
                    result += src[pos]
                }
            } else {
                result += next()
            }
        }
        next()
        return Token(TokenType.StringLiteral, result, ln, col, file)
    }

    private fun scanNumber(): Token {
        var res = ""
        var dotNum = 0
        while (isDigit(src[pos]) || src[pos] == '.') {
            if (src[pos] == '.') {
                dotNum++
                if (dotNum > 1) {
                    break
                }
            }
            res += next()
        }
        if (dotNum == 0) {
            return Token(TokenType.IntLiteral, res, ln, col, file)
        }
        return Token(TokenType.FloatLiteral, res, ln, col, file)
    }

    private fun scanIdentifier(): Token {
        var res = next()
        while (isLetterOrDigit(src[pos]) || src[pos] == '_') {
            res += next()
        }
        return Token(keywords[res] ?: TokenType.Identifier, res, ln, col, file)
    }

    private fun next(n: Int = 1): String {
        val res = src.substring(pos, pos + n)
        pos += n
        col++
        return res
    }

    private fun skipWhitespace() {
        while (isWhitespace(src[pos]) || test("//") || test("/*")) {
            if (src[pos] == '\n') {
                ln++
                col = 1
                pos++
            } else if (test("/*") || test("//")) {
                skipComment()
            } else {
                col++
                pos++
            }
        }
    }

    private fun skipComment() {
        if (test("/*")) {
            pos += 2
            while (!test("*/")) {
                if (src[pos] == '\n') {
                    ln++
                    col = 1
                }
                pos++
            }
            pos += 2
        } else if (test("//")) {
            while (src[pos] != '\n') {
                pos++
            }
            ln++
            col = 1
            pos++
        }
    }

    private fun test(st: String): Boolean {
        return src.startsWith(st, pos)
    }
}

private fun isWhitespace(ch: Char): Boolean {
    return ch == ' ' || ch == '\t' || ch == '\n' || ch == '\r'
}

private fun isLetter(ch: Char): Boolean {
    return ch.isLetter() || ch == '_'
}

private fun isLetterOrDigit(ch: Char): Boolean {
    return ch.isLetterOrDigit() || ch == '_'
}

private fun isDigit(ch: Char): Boolean {
    return ch.isDigit()
}

private val keywords = mapOf<String, TokenType>(
    "import" to TokenType.Import,
    "as" to TokenType.As,
    "true" to TokenType.True,
    "false" to TokenType.False,
    "null" to TokenType.Null,
    "var" to TokenType.Var,
    "const" to TokenType.Const,
    "func" to TokenType.Func,
    "if" to TokenType.If,
    "elif" to TokenType.Elif,
    "else" to TokenType.Else,
    "for" to TokenType.For,
    "while" to TokenType.While,
    "break" to TokenType.Break,
    "continue" to TokenType.Continue,
    "return" to TokenType.Return,
    "struct" to TokenType.Struct,
    "public" to TokenType.Public,
    "private" to TokenType.Private,
    "int" to TokenType.Int,
    "float" to TokenType.Float,
    "string" to TokenType.String,
    "bool" to TokenType.Bool,
    "char" to TokenType.Char
)

private val operators = mapOf<String, TokenType>(
    "(" to TokenType.LParen,
    ")" to TokenType.RParen,
    "{" to TokenType.LBrace,
    "}" to TokenType.RBrace,
    "[" to TokenType.LBracket,
    "]" to TokenType.RBracket,
    "." to TokenType.Dot,
    "," to TokenType.Comma,
    ":" to TokenType.Colon,
    "" to TokenType.Semicolon,
    "=" to TokenType.Assign,
    "+" to TokenType.Add,
    "-" to TokenType.Minus,
    "*" to TokenType.Mul,
    "/" to TokenType.Div,
    "%" to TokenType.Mod,
    "<" to TokenType.LessThan,
    "<=" to TokenType.LessEqual,
    ">" to TokenType.GreaterThan,
    ">=" to TokenType.GreaterEqual,
    "==" to TokenType.Equal,
    "!=" to TokenType.NotEqual,
    "&&" to TokenType.And,
    "||" to TokenType.Or,
    "!" to TokenType.Not,
    "&" to TokenType.BAnd,
    "|" to TokenType.BOr,
    "^" to TokenType.BXor,
    "~" to TokenType.BNot,
    "<<" to TokenType.LMove,
    ">>" to TokenType.RMove,
    "++" to TokenType.Increment,
    "--" to TokenType.Decrement
)
