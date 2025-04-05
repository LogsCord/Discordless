import { select } from "@inquirer/prompts";
import { ApiClient } from "./api.js";

class CommandHelper {

    constructor(private api: ApiClient) {}

    async selectProjectId(projectId: string | undefined): Promise<string> {

        // If no projectId provided, show selector
        if (!projectId) {
            const projects = await this.api.projects.list();

            if (projects.length === 0) {
                console.error("ℹ️ Aucun projet disponible.");
                process.exit(1);
            }

            return await select({
                message: "Sélectionnez le projet :",
                choices: projects.map((project) => ({
                    name: `Projet ${project._id} (${project.status})`,
                    value: project._id,
                })),
            });
        }

        return projectId;
    }

    async selectModuleId(moduleId: string | undefined): Promise<string> {

        // If no moduleId provided, show selector
        if (!moduleId) {
            const modules = await this.api.modules.list();

            if (modules.length === 0) {
                console.error("ℹ️ Aucun module disponible.");
                process.exit(1);
            }

            return await select({
                message: "Sélectionnez le module :",
                choices: modules.map((module) => ({
                    name: `${module.title} (${module.packageName})`,
                    value: module._id,
                })),
            });
        }

        return moduleId;
    }

    async selectModuleIdFromProject(projectId: string, moduleId: string | undefined): Promise<string> {
        const project = await this.api.projects.get(projectId);

        // If project has no modules
        if (project.modules.length === 0) {
            console.error("ℹ️ Aucun module installé.");
            process.exit(1);
        }

        // If moduleId is provided, check if it is installed
        if (moduleId) {
            if (!project.modules.includes(moduleId)) {
                console.error("ℹ️ Le module n'est pas installé sur ce projet.");
                process.exit(1);
            }

            return moduleId;
        }

        // Get module info for each installed module
        const modules = await Promise.all(project.modules.map(async (moduleId) => {
            try {
                return await this.api.modules.get(moduleId);

            } catch (err) {
                return {
                    _id: moduleId,
                    title: "Module non accessible",
                    packageName: moduleId,
                };
            }
        }));

        return await select({
            message: "Sélectionnez le module :",
            choices: modules.map((module) => ({
                name: `${module.title} (${module.packageName})`,
                value: module._id,
            }))
        });
    }

    async confirm(message: string): Promise<boolean> {
        return await select({
            message,
            choices: [
                { name: "Non", value: false },
                { name: "Oui", value: true },
            ],
        });
    }
}

export function getHelper(api: ApiClient): CommandHelper {
    return new CommandHelper(api);
}
