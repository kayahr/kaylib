import { AbstractValue } from "../../../main/observable/value/AbstractValue";

class TestValue<T = unknown> extends AbstractValue<T> {
    public constructor(public value: T, init?: () => void, tearDown?: () => void) {
        super(init, tearDown);
    }
    public override isValid(): boolean {
        return true;
    }
    public override validate(): void {
    }
    public override get(): T {
        return this.value;
    }
}

describe("Value", () => {
    it("can be called as getter function", () => {
        class TestValue2 extends TestValue<number> {
            public override get(): number {
                return 53;
            }
        }
        const value = new TestValue2(1);
        expect(value()).toBe(53);
    });
    it("provides the base functionality to be observable", () => {
        class TestValue2 extends TestValue<number> {
            public set(v: number): void {
                this.value = v;
                this.observer?.next(v);
            }
        }
        const value = new TestValue2(100);
        const spy = jest.fn();
        value.set(1);
        value.subscribe(spy);
        expect(spy).toHaveBeenCalledExactlyOnceWith(1);
        spy.mockClear();
        value.set(2);
        expect(spy).toHaveBeenCalledExactlyOnceWith(2);
    });
    it("calls optional init and tearDown callbacks on observable activation and deactivation", () => {
        const initSpy = jest.fn();
        const tearDownSpy = jest.fn();
        const value = new TestValue(3, initSpy, tearDownSpy);
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
        const value = new TestValue(4);
        expect(value[Symbol.observable]()).toBe(value);
        expect(value["@@observable"]()).toBe(value);
    });
    describe("getVersion", () => {
        it("returns 0 initially", () => {
            expect(new TestValue(5).getVersion()).toBe(0);
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
            expect(new TestValue2(6).test().getVersion()).toBe(1);
        });
    });
    describe("isWatched", () => {
        it("returns false when there is none subscriber", () => {
            const value = new TestValue(7);
            expect(value.isWatched()).toBe(false);
        });
        it("returns true when there is at least one subscriber", () => {
            const value = new TestValue(8);
            value.subscribe(() => {});
            expect(value.isWatched()).toBe(true);
        });
        it("returns false after last subscriber unsubscribes", () => {
            const value = new TestValue(9);
            const sub1 = value.subscribe(() => {});
            const sub2 = value.subscribe(() => {});
            sub1.unsubscribe();
            expect(value.isWatched()).toBe(true);
            sub2.unsubscribe();
            expect(value.isWatched()).toBe(false);
        });
    });
});
