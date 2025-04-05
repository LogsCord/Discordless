import os from "os";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { ApiClient, createClient, EncodedArg } from "./api.js";

// Too many people are using old Node.js versions, so we use the old-school way.
// Modern way (for Node 20+):
// import pkg from "../package.json" with { type: "json" };

export const pkg = (() => {
    try {
        return JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, "../package.json"), "utf-8"));

    } catch (err) {
        console.warn("⚠️  package.json introuvable. Soit t'es dans un conteneur, soit t'as fait un sale move 😅");
        return { version: "unknown" };
    }
})();

// 📁 Chemin vers le fichier d'auth locale
export const AUTH_PATH = path.join(os.homedir(), ".discordless", "auth.json");

// Helper function to get API client
export async function getApiClient(): Promise<ApiClient> {
    const auth = await fs.readJSON(AUTH_PATH).catch(() => null);

    if (!auth || !auth.apiKey) {
        console.error("❌ Veuillez vous connecter avec `discordless-cli login <apiKey>`");
        process.exit(1);
    }

    return createClient({ apiKey: auth.apiKey });
}

// Log formatting utilities
export function formatSeverity(severity: string): string {
    switch (severity) {
        case "error":
            return chalk.bgRed(chalk.bold(" ERROR "));
        case "warn":
            return chalk.bgYellow(chalk.bold(" WARN  "));
        case "debug":
            return chalk.bgGray(chalk.bold(" DEBUG "));
        default:
            return chalk.bgWhite(chalk.bold(" INFO  "));
    }
}

export function decodeArgs(args: EncodedArg[]): string[] {
    return args.map((arg) => {
        if (arg.type === "error")
            return chalk.red(arg.stack);

        if (arg.type === "object") {
            try {
                return `${arg.class} ${JSON.stringify(JSON.parse(arg.value!), null, 4)}`;

            } catch (err) {
                return `${arg.class} ${arg.value}`;
            }
        }

        return arg.value || "";
    });
}

export function colorizeArgs(severity: string, args: string[]): string[] {
    const color = (() => {
        switch (severity) {
            case "error":
                return chalk.red;
            case "warn":
                return chalk.yellow;
            case "info":
                return chalk.white;
            default:
                return chalk.gray;
        }
    })();

    return args.map((arg) => color(arg));
}
