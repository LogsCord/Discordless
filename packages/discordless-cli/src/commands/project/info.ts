import { getApiClient } from "../../utils.js";
import { getHelper } from "../../helper.js";

export async function getProjectInfo(projectId?: string) {
    try {
        const api = await getApiClient();
        const helper = getHelper(api);

        projectId = await helper.selectProjectId(projectId);

        const project = await api.projects.get(projectId);
        const statusEmoji = project.status === "running" ? "🟢" : "🔴";

        console.log(`\n${statusEmoji} Projet ${project._id}`);
        console.log(`Status: ${project.status}`);
        console.log(`Créé le: ${new Date(project.createdAt).toLocaleString()}`);
        console.log(`Dernière mise à jour: ${new Date(project.updatedAt).toLocaleString()}`);
        console.log("\nModules installés :");

        if (project.modules.length === 0) {
            console.log("  Aucun module installé");
            return;
        }

        for (const moduleId of project.modules) {
            try {
                const module = await api.modules.get(moduleId);

                console.log(`  - ${module.title} (${module.packageName})`);

            } catch (err) {
                console.log(`  - Module ${moduleId} (non accessible)`);
            }
        }

    } catch (err: any) {
        if (err instanceof Error && err.name === "ExitPromptError")
            return;

        console.error("❌ Erreur lors de la récupération des informations du projet:", err.response?.data?.message || err.message);
        console.error(err);
    }
}
