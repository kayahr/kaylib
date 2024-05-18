import { Dependency } from "./Dependency";
import type { Value } from "./Value";


export class ComputeContext {
    private static currentContext: ComputeContext | null = null;
    private readonly owner: Value;
    public readonly dependencies = new Map<Value, Dependency>();
    private watched = false;

    /**
     * Creates a new compute context for the giving owner value.
     *
     * @param owner - The computed value owning this context.
     */
    public constructor(owner: Value) {
        this.owner = owner;
    }

    /**
     * Checks if this context is valid. It does this be checking all its dependencies for validity. This is a recursive process because dependencies do not
     * only check if the latest seen version is up-to-date but they also ask the corresponding values if they are valid which (for computed values) results
     * in calling this very method on the corresponding computed context.
     *
     * @returns True if context is valid. False if it must be re-validated.
     */
    public isValid(): boolean {
        for (const dependency of this.dependencies.values()) {
            if (!dependency.isValid()) {
                return false;
            }
        }
        return true;
    }

    public validate(): boolean {
        let needUpdate = false;
        for (const dependency of this.dependencies.values()) {
            if (dependency.validate()) {
                needUpdate = true;
            }
        }
        return needUpdate;
    }

    public static registerDependency(value: Value): void {
        const context = this.currentContext;
        if (context != null) {
            const dependencies = context.dependencies;
            const dependency = dependencies.get(value);
            if (dependency == null) {
                const newDependency = new Dependency(value);
                dependencies.set(value, newDependency);
                if (context.watched) {
                    newDependency.watch(() => context.owner.get());
                }
            } else {
                dependency.update();
            }
        }
    }

    public recordDependencies<T>(func: () => T): T {
        const previousContext = ComputeContext.currentContext;
        ComputeContext.currentContext = this;
        try {
            return func();
        } finally {
            ComputeContext.currentContext = previousContext;
        }
    }

    public watch(): void {
        for (const dependency of this.dependencies.values()) {
            dependency.watch(() => this.owner.get());
        }
        this.watched = true;
    }

    public unwatch(): void {
        for (const dependency of this.dependencies.values()) {
            dependency.unwatch();
        }
        this.watched = false;
    }
}
