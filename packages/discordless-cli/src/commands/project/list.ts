import { getApiClient } from "../../utils.js";

export async function listProjects() {
    try {
        const api = await getApiClient();
        const projects = await api.projects.list();

        if (projects.length === 0) {
            console.log("ℹ️ Aucun projet disponible.");
            return;
        }

        console.log("💼 Projets disponibles :");

        for (const project of projects) {
            const statusEmoji = project.status === "running" ? "🟢" : "🔴";
            console.log(`\n${statusEmoji} Projet ${project._id}`);
            console.log(`  Status: ${project.status}`);
            console.log(`  Modules: ${project.modules.length}`);
        }

    } catch (err: any) {
        console.error("❌ Erreur lors de la récupération des projets:", err.response?.data?.message || err.message);
        console.error(err);
    }
}
