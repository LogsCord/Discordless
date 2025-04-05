import { Command } from "commander";

export function createModule(program: Command) {
    return async function createModule(packageName: string, name: string, description: string) {
        const initCommand = program.commands.find((cmd) => cmd.name() === "init");

        if (initCommand)
            await initCommand.parseAsync([process.argv[0], process.argv[1], "init", packageName, name, description]);
    };
};
