import { Select, Confirm, List } from "https://arweave.net/b4K9toBc51LZoKzXnXVFaz9TZaQKTIWPCl45yxgU8sc/mod.ts";
import { readerFromStreamReader, copy } from "https://deno.land/std@0.135.0/streams/conversion.ts";
import { tty } from "https://deno.land/x/cliffy@v0.23.0/ansi/tty.ts";
import { colors } from "https://deno.land/x/cliffy@v0.23.0/ansi/colors.ts";

tty.clearScreen()

console.log(
    colors.underline.bold.yellow("Made by Myoun")
)

async function process() {
    const apiServer = "https://papermc.io/api"

    const versionResult = await fetch(`${apiServer}/v2/projects/paper`)

    const versions = await versionResult.json().then((versionResponse) => { 
        return (versionResponse.versions as Array<string>).reverse()
    })


    const version: string = await Select.prompt({
        message : "Choose the version",
        options : versions
    })

    const buildResult = await fetch(`${apiServer}/v2/projects/paper/versions/${version}`)

    const builds = await buildResult.json().then((buildResponse) => {
        return (buildResponse.builds as Array<number>).reverse().map((it) => it.toString())
    })

    const build: string = await Select.prompt({
        message : "Choose the build",
        options : builds
    })

    const downloadNameResult = await fetch(`${apiServer}/v2/projects/paper/versions/${version}/builds/${build}`)

    const downloadName = await downloadNameResult.json().then((downloadUrlResponse) => {
        return (downloadUrlResponse.downloads.application.name as string)
    })

    const downloadUrl = `${apiServer}/v2/projects/paper/versions/${version}/builds/${build}/downloads/${downloadName}`

    const res = await fetch(downloadUrl);
    const file = await Deno.open(`./${downloadName}`, { create : true, write : true })

    const reader = readerFromStreamReader(res.body!.getReader())

    await copy(reader, file)

    file.close()

    const isEula : boolean = await Confirm.prompt("Generate eula.txt?")

    if (isEula) Deno.writeTextFile("./eula.txt", "eula=true")

    const canAddOps : boolean = await Confirm.prompt("Do you want to add Op?")

    if (canAddOps) {
        const mojangApi = "https://api.mojang.com/users/profiles/minecraft"
        
        const ops = await List.prompt("Enter some usernames");

        const opsWithUuid : Array<any> = []

        for (const username of ops) {
            opsWithUuid.push(
                await fetch(`${mojangApi}/${username}`)
                    .then((res) => {{
                        return res.json()
                    }})
            )
        }

        const finalOpPlayers = `[${opsWithUuid.map((op) => (JSON.stringify({
            uuid : op.id,
            name : op.name,
            level : 4,
            bypassesPlayerLimit : false
        }))).toString()}]`

        
        Deno.writeTextFile("./ops.json", finalOpPlayers)    
    }
}

await process()

export default process