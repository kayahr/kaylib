declare module "es-observable-tests" {
    export function runTests(implementation: unknown): Promise<{
        logger: {
            passed: number;
            failed: number;
            errored: number;
        }
    }>;
}
