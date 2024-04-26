export enum ExprType {
    IntLiteral,
    FloatLiteral,
    StringLiteral,
    Nil,
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
