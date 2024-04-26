export enum SimpleObjectType {
    Int,
    Float,
    String,
    Bool,
    Char,
    Nil,
    Array,
    Struct,
    Fn,
    File,
}

export interface ObjectType {
    singleType: SimpleObjectType
}
