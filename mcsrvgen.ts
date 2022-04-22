import { tty } from "https://deno.land/x/cliffy@v0.23.0/ansi/tty.ts";
import { colors } from "https://deno.land/x/cliffy@v0.23.0/ansi/colors.ts";
import { process } from "./process.ts"

tty.clearScreen()

console.log(
    colors.underline.bold.yellow("Made by Myoun")
)

await process()

export default process