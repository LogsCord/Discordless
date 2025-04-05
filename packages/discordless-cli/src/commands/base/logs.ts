import chalk from "chalk";
import { getApiClient, formatSeverity, decodeArgs, colorizeArgs } from "../../utils.js";
import { getHelper } from "../../helper.js";

export async function logs(moduleName: string | undefined) {
    try {
        const api = await getApiClient();
        const helper = getHelper(api);

        moduleName = await helper.selectModuleId(moduleName);

        console.log(`📝 Streaming des logs pour le module "${moduleName}"...`);
        console.log("Appuyez sur Ctrl+C pour arrêter");
        console.log();

        // Stream logs in real-time
        for await (const log of api.logs.stream(moduleName)) {
            const timestamp = new Date(log.timestamp).toLocaleTimeString(undefined, { hour12: false });
            const decodedArgs = decodeArgs(log.args);
            const colorizedArgs = colorizeArgs(log.severity, decodedArgs);

            console.log(
                chalk.gray(`(${timestamp})`),
                formatSeverity(log.severity),
                ...colorizedArgs
            );
        }

    } catch (err: any) {
        if (err instanceof Error && err.name === "ExitPromptError")
            return;

        console.error(`❌ Erreur lors du streaming des logs : ${err.message}`);
        console.error(err);
    }
}
