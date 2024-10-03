import compiler.parser.Lexer

fun main() {
    val src = "import io as io\n" +
            "\n" +
            "var a = 1\n" +
            "\n" +
            "io.print(a)"
    val lexer = Lexer(src, "file")
    for (i in 0 until 114) {
        println(lexer.nextToken())
    }
}