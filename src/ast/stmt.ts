import { Expr, IdentifierExpr } from "./expr"
import { ObjectType } from "./object_type"

export enum StmtType {
    _,
    Block,
    If,
    While,
    For,
    Break,
    Continue,
    Return,
    Expr,
    VarDef,
    FnDef,
    StructDef,
    Import,
}

export interface Stmt {
    line: number
    colum: number
    type: StmtType
}

export interface TypeField {
    line: number
    column: number
    names: string[]
    types: ObjectType[]
    values: Expr[]
}

export interface Block extends Stmt {
    type: StmtType.Block
    stmts: Stmt[]
}

export interface IfStmt extends Stmt {
    type: StmtType.If
    conditions: Expr[]
    blocks: Block[]
}

export interface WhileStmt extends Stmt {
    type: StmtType.While
    condition: Expr
    block: Block
}

export interface ForStmt extends Stmt {
    type: StmtType.For
    init: Stmt | null
    condition: Expr | null
    post: Stmt | null
    block: Block
}

export interface BreakStmt extends Stmt {
    type: StmtType.Break
}

export interface ContinueStmt extends Stmt {
    type: StmtType.Continue
}

export interface ReturnStmt extends Stmt {
    type: StmtType.Return
    expr: Expr | null
}

export interface ExprStmt extends Stmt {
    type: StmtType.Expr
    expr: Expr
}

export interface VarDefStmt extends Stmt {
    type: StmtType.VarDef
    field: TypeField
}

export interface FnDefStmt extends Stmt {
    type: StmtType.FnDef
    name: string
    params: TypeField
    block: Block
}

export interface StructDefStmt extends Stmt {
    type: StmtType.StructDef
    name: string
    field: TypeField
}

export interface ImportStmt extends Stmt {
    type: StmtType.Import
    path: string
    identifier: IdentifierExpr | null
}
