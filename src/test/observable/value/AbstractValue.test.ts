import { AbstractValue } from "../../../main/observable/value/AbstractValue";

class TestValue<T = unknown> extends AbstractValue<T> {
    public override isValid(): boolean {
        throw new Error("Method not implemented.");
    }
    public override validate(): void {
        throw new Error("Method not implemented.");
    }
    public override get(): T {
        throw new Error("Method not implemented.");
    }
}

describe("Value", () => {
    it("can be called as getter function", () => {
        class TestValue2 extends TestValue<number> {
            public override get(): number {
                return 53;
            }
        }
        const value = new TestValue2();
        expect(value()).toBe(53);
    });
    it("provides the base functionality to be observable", () => {
        class TestValue2 extends TestValue<number> {
            public set(v: number): void {
                this.observer?.next(v);
            }
        }
        const value = new TestValue2();
        const spy = jest.fn();
        value.set(1);
        value.subscribe(spy);
        expect(spy).not.toHaveBeenCalled();
        value.set(2);
        expect(spy).toHaveBeenCalledExactlyOnceWith(2);
    });
    it("calls optional init and tearDown callbacks on observable activation and deactivation", () => {
        const initSpy = jest.fn();
        const tearDownSpy = jest.fn();
        const value = new TestValue(initSpy, tearDownSpy);
        const sub1 = value.subscribe(() => {});
        expect(initSpy).toHaveBeenCalledOnce();
        expect(tearDownSpy).not.toHaveBeenCalled();
        const sub2 = value.subscribe(() => {});
        expect(initSpy).toHaveBeenCalledOnce();
        expect(tearDownSpy).not.toHaveBeenCalled();
        sub1.unsubscribe();
        expect(initSpy).toHaveBeenCalledOnce();
        expect(tearDownSpy).not.toHaveBeenCalled();
        sub2.unsubscribe();
        expect(initSpy).toHaveBeenCalledOnce();
        expect(tearDownSpy).toHaveBeenCalledOnce();
        const sub3 = value.subscribe(() => {});
        expect(initSpy).toHaveBeenCalledTimes(2);
        sub3.unsubscribe();
        expect(tearDownSpy).toHaveBeenCalledTimes(2);
    });
    it("implements the observable symbols", () => {
        const value = new TestValue();
        expect(value[Symbol.observable]()).toBe(value);
        expect(value["@@observable"]()).toBe(value);
    });
    describe("getVersion", () => {
        it("returns 0 initially", () => {
            expect(new TestValue().getVersion()).toBe(0);
        });
    });
    describe("incrementVersion", () => {
        it("increments the version by 1", () => {
            class TestValue2 extends TestValue {
                public test(): this {
                    this.incrementVersion();
                    return this;
                }
            }
            expect(new TestValue2().test().getVersion()).toBe(1);
        });
    });
    describe("isWatched", () => {
        it("returns false when there is none subscriber", () => {
            const value = new TestValue();
            expect(value.isWatched()).toBe(false);
        });
        it("returns true when there is at least one subscriber", () => {
            const value = new TestValue();
            value.subscribe(() => {});
            expect(value.isWatched()).toBe(true);
        });
        it("returns false after last subscriber unsubscribes", () => {
            const value = new TestValue();
            const sub1 = value.subscribe(() => {});
            const sub2 = value.subscribe(() => {});
            sub1.unsubscribe();
            expect(value.isWatched()).toBe(true);
            sub2.unsubscribe();
            expect(value.isWatched()).toBe(false);
        });
    });
});
