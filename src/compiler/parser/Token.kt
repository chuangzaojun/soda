package compiler.parser

enum class TokenType {
    EndOfFile,

    Unknown,

    Identifier,

    LParen, // (
    RParen, // )
    LBracket, // [
    RBracket, // ]
    LBrace, // {
    RBrace, // }

    Comma, // ,
    Semicolon, // ;
    Colon, // :
    Dot, //.

    Assign, // =
    Minus, // -
    Add, // +
    Mul, // *
    Div, // /
    Mod, // %
    LessThan, // <
    LessEqual, // <=
    GreaterThan, // >
    GreaterEqual, // >=
    Equal, // ==
    NotEqual, // !=

    And, // &&
    Or, // ||
    Not, // !

    BAnd, // &
    BOr, // |
    BNot, // ~
    BXor, // ^
    LMove, // <<
    RMove, // >>
    Increment, // ++
    Decrement, // --

    // keywords
    Import,
    As,
    True,
    False,
    Null,
    Var,
    Const,
    Func,
    If,
    Elif,
    Else,
    For,
    While,
    Break,
    Continue,
    Return,
    Struct,

    Public,
    Private,

    // type
    Int,
    Float,
    Bool,
    String,
    Char,

    // literals
    IntLiteral,
    FloatLiteral,
    StringLiteral,
    CharLiteral,
}

data class Token(
    val type: TokenType,
    val literal: String,
    val line: Int,
    val column: Int,
    val file: String
)