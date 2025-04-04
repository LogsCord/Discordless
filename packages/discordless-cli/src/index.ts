#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs-extra";
import os from "os";
import path from "path";
import axios from "axios";
import { select } from "@inquirer/prompts";

// Too many people are using old Node.js versions, so we use the old-school way.
// Modern way (for Node 20+):
// import pkg from "../package.json" with { type: "json" };

const pkg = (() => {
    try {
        return JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, "../package.json"), "utf-8"));

    } catch (err) {
        console.warn("⚠️  package.json introuvable. Soit t'es dans un conteneur, soit t'as fait un sale move 😅");
        return { version: "unknown" };
    }
})();

type DiscordlessUser = {
    userId: string;
    discordId: string;
    username: string;
    avatar: string;
    email: string;
};

type DiscordlessModule = {
    _id: string;
    owner: string;
    packageName: string;
    title: string;
    description: string;
    flags: string[];
    configSchema: any[];
    createdAt: string;
    updatedAt: string;
};

// 📁 Chemin vers le fichier d'auth locale
const AUTH_PATH = path.join(os.homedir(), ".discordless", "auth.json");

const program = new Command();

program
    .name("discordless-cli")
    .description(`✨ CLI pour bots Discordless – Code less. Sleep better.\n🌐 https://discordless.dev`)
    .version(pkg.version);

// 📌 LOGIN
program
    .command("login")
    .argument("<apiKey>", "Votre clé API Discordless")
    .description("Se connecter à Discordless")
    .action(async (apiKey: string) => {
        await fs.ensureDir(path.dirname(AUTH_PATH));

        try {
            const res = await axios.get("https://discordless.dev/api/users/@me", {
                headers: {
                    Authorization: `Bearer ${apiKey}`
                }
            });

            const user: DiscordlessUser = res.data;

            // Écriture dans le fichier local
            await fs.writeJSON(AUTH_PATH, { apiKey }, { spaces: 4 });

            console.log(`✅ Connecté en tant que ${user.username} (${user.email})`);
            console.log("🔐 API key sauvegardée localement.");

        } catch (err: any) {
            console.error("❌ Échec de la connexion : clé invalide ou erreur réseau.");
            process.exit(1);
        }
    });


// 📦 PULL
program
    .command("pull")
    .argument("[module]", "Nom du module à récupérer")
    .description("Récupérer un module distant")
    .action(async (module: string | undefined) => {
        const auth = await fs.readJSON(AUTH_PATH).catch(() => null);

        if (!auth?.apiKey) {
            console.error("❌ Veuillez vous connecter avec `discordless-cli login <apiKey>`");
            process.exit(1);
        }

        if (!module) {
            const res = await axios.get("https://discordless.dev/api/modules", {
                headers: {
                    Authorization: `Bearer ${auth.apiKey}`
                }
            });

            const modules = res.data as DiscordlessModule[];

            if (modules.length === 0) {
                console.log("Vous n'avez aucun module.");
                process.exit(0);
            }

            const selected = await select({
                message: "Quel module voulez-vous récupérer ?",
                choices: modules.map((module) => ({
                    name: `${module.title} (${module.packageName})`,
                    value: module.packageName
                }))
            });

            module = selected;
        }

        const moduleInfo = await axios.get<DiscordlessModule>(
            `https://discordless.dev/api/modules/${module}`, {
            headers: {
                Authorization: `Bearer ${auth.apiKey}`
            }
        }).then((res) => res.data);

        const { _id, packageName } = moduleInfo;

        // 🔧 Crée un dossier du nom du package
        const moduleDir = path.join(process.cwd(), packageName);
        await fs.ensureDir(moduleDir);

        // 📁 Crée le fichier de config dans le dossier du module
        const config = {
            id: _id,
            package: packageName
        };

        await fs.writeJSON(path.join(moduleDir, ".discordless.json"), config, { spaces: 2 });
        console.log(`📦 Module "${packageName}" récupéré avec ID "${_id}".`);

        // 📄 Liste des fichiers
        const filesRes = await axios.get(`https://discordless.dev/api/modules/${packageName}/files/`, {
            headers: {
                Authorization: `Bearer ${auth.apiKey}`
            }
        });

        const files = filesRes.data.files;

        if (!files || files.length === 0) {
            console.log("Ce module ne contient aucun fichier.");
            return;
        }

        // ⬇️ Récupération et écriture des fichiers dans le dossier du module
        for (const file of files) {
            if (file.isDirectory) continue;

            const contentRes = await axios.get(
                `https://discordless.dev/api/modules/${packageName}/content${file.path}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.apiKey}`
                    }
                }
            );

            const filePath = path.join(moduleDir, file.path);
            await fs.ensureDir(path.dirname(filePath));
            await fs.writeFile(filePath, contentRes.data.content, "utf-8");

            console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
        }

        console.log(`📥 Pull terminé. Fichiers disponibles dans ./` + packageName);
    });

// 🚀 DEPLOY
program
    .command("deploy")
    .description("Déployer le module actuel")
    .action(async () => {
        // Trouver .discordless.json
        const cwd = process.cwd();
        const configPath = path.join(cwd, ".discordless.json");

        if (!await fs.pathExists(configPath)) {
            console.error("❌ Fichier .discordless.json manquant. Faites un \"pull\" d'abord.");
            process.exit(1);
        }

        const config = await fs.readJSON(configPath);

        // Lire l'API key
        const auth = await fs.readJSON(AUTH_PATH).catch(() => null);

        if (!auth?.apiKey) {
            console.error("❌ Vous devez être connecté. Faites \"discordless-cli login <apiKey>\".");
            process.exit(1);
        }

        // Fonction récursive pour aller dans tous les sous-dossiers
        async function getFiles(dir: string): Promise<string[]> {
            const dirents = await fs.readdir(dir, { withFileTypes: true });

            const files = await Promise.all(dirents.map(async (dirent) => {
                const res = path.resolve(dir, dirent.name);

                if (dirent.isDirectory()) {
                    return await getFiles(res);

                } else {
                    return res;
                }
            }));

            return files.flat();
        }

        const files = await getFiles(cwd);

        // Filtrage des fichiers à ignorer
        const ignored = ["node_modules", ".git", ".discordless.json"];

        const deployableFiles = files.filter((file) => {
            const relative = path.relative(cwd, file);

            return !ignored.some((ig) => relative.startsWith(ig));
        });

        if (deployableFiles.length === 0) {
            console.log("📁 Aucun fichier à déployer.");
            return;
        }

        console.log(`📦 Déploiement de ${deployableFiles.length} fichier(s)...`);

        for (const fullPath of deployableFiles) {
            const relativePath = path.relative(cwd, fullPath).replace(/\\/g, "/"); // Windows fix
            const content = await fs.readFile(fullPath, "utf-8");

            try {
                await axios.put(
                    `https://discordless.dev/api/modules/${config.package}/content/${relativePath}`,
                    { content },
                    {
                        headers: {
                            Authorization: `Bearer ${auth.apiKey}`
                        }
                    }
                );

                console.log(`✅ ${relativePath}`);

            } catch (err: any) {
                console.error(`❌ Erreur sur ${relativePath} :`, err.response?.data || err.message);
            }
        }

        console.log("🚀 Déploiement terminé !");
    });

program.parse();
