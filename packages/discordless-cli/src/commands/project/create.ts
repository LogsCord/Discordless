import { getApiClient } from "../../utils.js";

export async function createProject(token: string) {
    try {
        const api = await getApiClient();
        const project = await api.projects.create({ token });

        console.log(`✅ Projet créé avec succès !`);
        console.log(`🔑 ID: ${project._id}`);

    } catch (err: any) {
        console.error("❌ Erreur lors de la création du projet:", err.response?.data?.message || err.message);
        console.error(err);
    }
}
