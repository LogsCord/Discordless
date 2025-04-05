# 📜 Changelog – `discordless`

All notable changes to this project will be documented in this file.

## [0.1.3] – 2025-04-06

### ✨ New Features

- Added `logs [module]` command to display real-time logs of a deployed module
- Added `init <packageName> <name> <description>` command to quickly initialize a new module
- Added `module create` subcommand to create a new module via CLI
- Added `module delete` subcommand to delete a module
- Added `module list` subcommand to list all available modules
- Introduced full project management support:
  - `project create`
  - `project delete`
  - `project start`
  - `project stop`
  - `project list`
  - `project info`
  - `project install`
  - `project uninstall`

### ✅ Improvements

- Added confirmation prompts before deleting a **module** or a **project** to prevent accidental removals
- Refactored the CLI command display into clearly structured sections (`Authentication`, `Modules`, `Projects`)
- Improved and standardized command descriptions for better readability

### 🛠 Refactoring

- Created a dedicated `api.ts` file to handle all API interactions with Discordless
- This file will soon be extracted into a **standalone TypeScript library** to provide developers with a clean and reusable interface for interacting with the Discordless API


## [0.1.2] – Initial Release

### 🚀 Core Features

- `login <apiKey>` – Log in to Discordless using an API key
- `pull [module]` – Fetch a remote module and its associated files
- `deploy` – Deploy the current module defined in `.discordless.json`
