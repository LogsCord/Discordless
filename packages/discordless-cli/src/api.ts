import axios from "axios";

export type DiscordlessUser = {
    userId: string;
    discordId: string;
    username: string;
    avatar: string;
    email: string;
};

export type DiscordlessModule = {
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

export type DiscordlessProject = {
    _id: string;
    owner: string;
    token: string;
    modules: string[];
    status: "running" | "stopped";
    createdAt: string;
    updatedAt: string;
};

export type EncodedArg = {
    type: "string"
        | "number"
        | "boolean"
        | "object"
        | "array"
        | "class"
        | "function"
        | "symbol"
        | "bigint"
        | "null"
        | "undefined"
        | "error";
    value?: string;
    class?: string;
    name?: string;
    message?: string;
    stack?: string;
};

export type LogEntry = {
    severity: "info" | "warn" | "error" | "debug";
    args: EncodedArg[];
    timestamp: number;
};

export type ApiClientConfig = {
    apiKey: string;
    baseUrl?: string;
};

export type DiscordlessModuleFile = {
    name: string;
    path: string;
    size: number;
    isDirectory: boolean;
    lastModified: string;
};

export class ApiClient {
    private readonly baseUrl: string;
    private readonly headers: { Authorization: string };

    constructor(config: ApiClientConfig) {
        this.baseUrl = config.baseUrl || "https://discordless.dev/api";
        this.headers = {
            Authorization: `Bearer ${config.apiKey}`
        };
    }

    modules = {
        list: async (): Promise<DiscordlessModule[]> => {
            const res = await axios.get(`${this.baseUrl}/modules`, {
                headers: this.headers
            });
            return res.data;
        },

        get: async (moduleId: string): Promise<DiscordlessModule> => {
            const res = await axios.get(`${this.baseUrl}/modules/${moduleId}`, {
                headers: this.headers
            });
            return res.data;
        },

        create: async (data: { packageName: string; title: string; description: string }): Promise<DiscordlessModule> => {
            const res = await axios.post(`${this.baseUrl}/modules`, data, {
                headers: this.headers
            });
            return res.data;
        },

        delete: async (moduleId: string): Promise<void> => {
            await axios.delete(`${this.baseUrl}/modules/${moduleId}`, {
                headers: this.headers
            });
        },

        files: {
            list: async (moduleId: string): Promise<DiscordlessModuleFile[]> => {
                const res = await axios.get(`${this.baseUrl}/modules/${moduleId}/files`, {
                    headers: this.headers
                });

                return res.data;
            },

            get: async (moduleId: string, filePath: string): Promise<string> => {
                const res = await axios.get(`${this.baseUrl}/modules/${moduleId}/files/content/${filePath}`, {
                    headers: this.headers
                });

                return res.data.content;
            },

            put: async (moduleId: string, filePath: string, content: string): Promise<void> => {
                await axios.put(`${this.baseUrl}/modules/${moduleId}/files/content/${filePath}`, { content }, {
                    headers: this.headers
                });
            },
        },
    };

    projects = {
        list: async (): Promise<DiscordlessProject[]> => {
            const res = await axios.get(`${this.baseUrl}/projects`, {
                headers: this.headers
            });
            return res.data;
        },

        get: async (projectId: string): Promise<DiscordlessProject> => {
            const res = await axios.get(`${this.baseUrl}/projects/${projectId}`, {
                headers: this.headers
            });
            return res.data;
        },

        create: async (data: { token: string }): Promise<DiscordlessProject> => {
            const res = await axios.post(`${this.baseUrl}/projects`, data, {
                headers: this.headers
            });
            return res.data;
        },

        delete: async (projectId: string): Promise<void> => {
            await axios.delete(`${this.baseUrl}/projects/${projectId}`, {
                headers: this.headers
            });
        },

        start: async (projectId: string, token?: string): Promise<void> => {
            await axios.post(
                `${this.baseUrl}/projects/${projectId}/start`,
                token ? { token } : {},
                { headers: this.headers }
            );
        },

        stop: async (projectId: string): Promise<void> => {
            await axios.post(
                `${this.baseUrl}/projects/${projectId}/stop`,
                {},
                { headers: this.headers }
            );
        },

        installModule: async (projectId: string, moduleId: string): Promise<void> => {
            await axios.post(
                `${this.baseUrl}/projects/${projectId}/modules/${moduleId}`,
                {},
                { headers: this.headers }
            );
        },

        uninstallModule: async (projectId: string, moduleId: string): Promise<void> => {
            await axios.delete(
                `${this.baseUrl}/projects/${projectId}/modules/${moduleId}`,
                { headers: this.headers }
            );
        }
    };

    users = {
        me: async (): Promise<DiscordlessUser> => {
            const res = await axios.get(`${this.baseUrl}/users/@me`, {
                headers: this.headers
            });
            return res.data;
        }
    };

    logs = {
        stream: (moduleId: string): AsyncGenerator<LogEntry, void, unknown> => {
            const headers = this.headers;

            return (async function* () {
                const { createEventSource } = await import("eventsource-client");
                let queue: LogEntry[] = [];
                let error: Error | null = null;
                let resolveNext: ((value: IteratorResult<LogEntry, void>) => void) | null = null;

                const eventSource = createEventSource({
                    url: `https://discordless.dev/api/modules/${moduleId}/logs`,
                    headers,
                    onMessage(event) {
                        try {
                            const log = JSON.parse(event.data) as LogEntry;

                            if (resolveNext) {
                                resolveNext({ done: false, value: log });
                                resolveNext = null;

                            } else {
                                queue.push(log);
                            }

                        } catch (e: any) {
                            console.error("Failed to parse log entry:", e);
                        }
                    },
                });

                try {
                    while (true) {
                        if (error) throw error;

                        if (queue.length > 0) {
                            yield queue.shift()!;

                        } else {
                            const next = await new Promise<IteratorResult<LogEntry, void>>((resolve) => (resolveNext = resolve));

                            if (next.done)
                                break;

                            yield next.value;
                        }
                    }

                } finally {
                    eventSource.close();
                }
            })();
        }
    };
}

export function createClient(config: ApiClientConfig): ApiClient {
    return new ApiClient(config);
}
