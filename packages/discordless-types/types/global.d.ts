type Config = {
    getNumber(key: string): number;
};

type UserStore = {
    add(key: string, value: number): void;
};

type RateLimit = {
    consume(key: string): boolean;
};

type StateRecorder = {
    updateState(key: string, value: any): void;
};

declare global {
    const config: Config;
    const getUserStore: (userId: string) => UserStore;
    const getUserRateLimit: (userId: string) => RateLimit;
    const getStateRecorder: (userId: string) => StateRecorder;
    const registerListener: (event: string, callback: (...args: any[]) => void) => void;
}

export {}
