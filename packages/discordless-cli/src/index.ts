#!/usr/bin/env node
import { Command } from "commander";
import { pkg } from "./utils.js";

// Project commands
import { getProjectInfo } from "./commands/project/info.js";
import { startProject } from "./commands/project/start.js";
import { stopProject } from "./commands/project/stop.js";
import { listProjects } from "./commands/project/list.js";
import { installModule } from "./commands/project/install.js";
import { uninstallModule } from "./commands/project/uninstall.js";
import { createProject } from "./commands/project/create.js";
import { deleteProject } from "./commands/project/delete.js";

// Module commands
import { createModule } from "./commands/module/create.js";
import { deleteModule } from "./commands/module/delete.js";
import { listModules } from "./commands/module/list.js";

// Base commands
import { login } from "./commands/base/login.js";
import { pull } from "./commands/base/pull.js";
import { deploy } from "./commands/base/deploy.js";
import { logs } from "./commands/base/logs.js";
import { init } from "./commands/base/init.js";

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
    .action(login);

// 📦 PULL
program
    .command("pull")
    .argument("[module]", "Nom du module à récupérer")
    .description("Récupérer un module distant")
    .action(pull);

// 🚀 DEPLOY
program
    .command("deploy")
    .description("Déployer le module actuel")
    .action(deploy);

// 📜 LOGS
program
    .command("logs")
    .argument("[module]", "Nom du module dont vous souhaitez suivre les logs")
    .description("Afficher les logs temps réel d'un module déployé")
    .action(logs);

// Module management commands
program
    .command("init")
    .argument("<packageName>", "Package name (e.g., com.module.example)")
    .argument("<name>", "Module name")
    .argument("<description>", "Module description")
    .description("Create a new module")
    .action(init);

// Alias "module create" to "init"
const commandModule = program.command("module");

commandModule
    .command("create")
    .argument("<packageName>", "Package name (e.g., com.module.example)")
    .argument("<name>", "Module name")
    .argument("<description>", "Module description")
    .description("Create a new module (alias for init)")
    .action(createModule(program));

// Module delete command
commandModule
    .command("delete")
    .argument("[moduleId]", "Module ID to delete")
    .description("Delete a module")
    .action(deleteModule);

// Module list command
commandModule
    .command("list")
    .description("List all modules")
    .action(listModules);

// Project management commands
const commandProject = program
    .command("project");

// Project create command
commandProject
    .command("create")
    .argument("<token>", "Discord bot token")
    .description("Create a new project")
    .action(createProject);

// Project delete command
commandProject
    .command("delete")
    .argument("[projectId]", "Project ID to delete")
    .description("Delete a project")
    .action(deleteProject);

// Project start command
commandProject
    .command("start")
    .argument("[projectId]", "Project ID to start")
    .argument("[token]", "Optional new Discord bot token")
    .description("Start a project")
    .action(startProject);

// Project stop command
commandProject
    .command("stop")
    .argument("[projectId]", "Project ID to stop")
    .description("Stop a project")
    .action(stopProject);

// Project list command
commandProject
    .command("list")
    .description("List all projects")
    .action(listProjects);

// Project info command
commandProject
    .command("info")
    .argument("[projectId]", "Project ID to show info for")
    .description("Show project information")
    .action(getProjectInfo);

// Project install module command
commandProject
    .command("install")
    .argument("[projectId]", "Project ID to install module to")
    .argument("[moduleId]", "Module ID to install")
    .description("Install a module to a project")
    .action(installModule);

// Project uninstall module command
commandProject
    .command("uninstall")
    .argument("[projectId]", "Project ID to uninstall module from")
    .argument("[moduleId]", "Module ID to uninstall")
    .description("Uninstall a module from a project")
    .action(uninstallModule);

// Parse command line arguments
program.parse();
