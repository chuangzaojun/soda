export enum TokenType {
    _,
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
    True,
    False,
    Nil,
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
    Void,

    // literals
    IntLiteral,
    FloatLiteral,
    StringLiteral,
    CharLiteral,
}

export interface Token {
    type: TokenType
    literal: string
    line: number
    column: number
    file: string
}
