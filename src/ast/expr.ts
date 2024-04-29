export enum ExprType {
    IntLiteral,
    FloatLiteral,
    StringLiteral,
    Null,
    True,
    False,
    Identifier,
    ArrayIndex,
    ArrayLiteral,
    FnCall,
    Binary,
    Prefix,
    Member,
    Type,
    TypeTrans,
}

export interface Expr {
    type: ExprType
    line: number
    column: number
}

export interface IdentifierExpr extends Expr {
    type: ExprType.Identifier
    name: string
}

export interface IntLiteralExpr extends Expr {
    type: ExprType.IntLiteral
    value: number
}

export interface FloatLiteralExpr extends Expr {
    type: ExprType.FloatLiteral
    value: number
}

export interface StringLiteralExpr extends Expr {
    type: ExprType.StringLiteral
    value: string
}

export interface NullExpr extends Expr {
    type: ExprType.Null
}

export interface TrueExpr extends Expr {
    type: ExprType.True
}

export interface FalseExpr extends Expr {
    type: ExprType.False
}

export interface ArrayIndexExpr extends Expr {
    type: ExprType.ArrayIndex
    array: Expr
    index: Expr
}

export interface ArrayLiteralExpr extends Expr {
    type: ExprType.ArrayLiteral
    elements: Expr[]
}

export interface FnCallExpr extends Expr {
    type: ExprType.FnCall
    fn: Expr
    args: Expr[]
}

export enum OpType {
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
}

export interface BinaryExpr extends Expr {
    type: ExprType.Binary
    left: Expr
    op: OpType
    right: Expr
}

export interface PrefixExpr extends Expr {
    type: ExprType.Prefix
    op: OpType
    right: Expr
}

export interface MemberExpr extends Expr {
    type: ExprType.Member
    father: Expr
    member: string
}

export interface TypeTransExpr extends Expr {
    type: ExprType.TypeTrans
    targetType: Expr
    expr: Expr
}
