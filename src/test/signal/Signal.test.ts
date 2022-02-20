import { Signal, SignalException } from "../../main/signal/Signal";

describe("Signal", () => {
    describe("used as function", () => {
        it("emits signal without arguments", () => {
            const slot1 = jest.fn();
            const slot2 = jest.fn();
            const signal = new Signal();
            signal.connect(slot1);
            signal.connect(slot2);
            signal();
            expect(slot1).toHaveBeenCalledOnce();
            expect(slot2).toHaveBeenCalledOnce();
        });
        it("emits signal with single argument", () => {
            const slot1 = jest.fn((a: number) => {});
            const slot2 = jest.fn((b: number) => {});
            const signal = new Signal<[ number ]>();
            signal.connect(slot1);
            signal.connect(slot2);
            signal(23);
            expect(slot1).toHaveBeenCalledOnce();
            expect(slot1).toHaveBeenCalledWith(23);
            expect(slot2).toHaveBeenCalledOnce();
            expect(slot2).toHaveBeenCalledWith(23);
        });
        it("emits signal with multiple argument", () => {
            const slot1 = jest.fn((a: number, b: string[]) => {});
            const slot2 = jest.fn((a: number, b: string[]) => {});
            const signal = new Signal<[ number, string[] ]>();
            signal.connect(slot1);
            signal.connect(slot2);
            signal(23, [ "test" ]);
            expect(slot1).toHaveBeenCalledOnce();
            expect(slot1).toHaveBeenCalledWith(23, [ "test" ]);
            expect(slot2).toHaveBeenCalledOnce();
            expect(slot2).toHaveBeenCalledWith(23, [ "test" ]);
        });
        it("does not emit to disconnected slot", () => {
            const slot1 = jest.fn();
            const slot2 = jest.fn();
            const signal = new Signal();
            signal.connect(slot1);
            signal.connect(slot2);
            signal.disconnect(slot1);
            signal();
            expect(slot1).not.toHaveBeenCalled();
            expect(slot2).toHaveBeenCalledOnce();
        });
        it("can emit signal to methods", () => {
            class Test {
                public value: number = 0;
                public setValue(value: number): void {
                    this.value = value;
                }
            }
            const test = new Test();
            const signal = new Signal<[ number ]>();
            signal.connect(test.setValue, test);
            expect(test.value).toBe(0);
            signal(42);
            expect(test.value).toBe(42);
        });
    });
    describe("toString", () => {
        it("returns correct string representation", () => {
            expect(new Signal().toString()).toBe("[object Signal]");
        });
    });
    describe("connect", () => {
        it("throws exception when connecting already connected named function", () => {
            function slot1(): void {}
            const slot2 = (): void => {};
            const signal = new Signal();
            signal.connect(slot1);
            signal.connect(slot2);
            expect(() => signal.connect(slot1)).toThrowWithMessage(SignalException,
                "Slot 'slot1' is already connected");
            expect(() => signal.connect(slot2)).toThrowWithMessage(SignalException,
                "Slot 'slot2' is already connected");
        });
        it("throws exception when connecting already connected anonymous function", () => {
            const signal = new Signal();
            const connect = (slot: () => void): void => {
                signal.connect(slot);
                signal.connect(slot);
            };
            expect(() => connect(() => {})).toThrowWithMessage(SignalException,
                "Slot '<anonymous>' is already connected");
        });
        it("throws exception when connecting already connected method", () => {
            class Test {
                public foo(): void {}
            }
            const signal = new Signal();
            const test = new Test();
            signal.connect(test.foo, test);
            expect(() => signal.connect(test.foo, test)).toThrowWithMessage(SignalException,
                "Slot 'Test::foo' is already connected");
        });
        it("throws exception when connecting already connected anonymous method", () => {
            class Test {
                public foo(): void {}
            }
            const signal = new Signal();
            const test = new Test();
            const connect = (method: () => void): void => {
                signal.connect(method, test);
                signal.connect(method, test);
            };
            expect(() => connect(() => {})).toThrowWithMessage(SignalException,
                "Slot 'Test::<anonymous>' is already connected");
        });
        it("connects a function", () => {
            const slot = jest.fn();
            const signal = new Signal();
            expect(signal.isConnected(slot)).toBe(false);
            signal.connect(slot);
            expect(signal.isConnected(slot)).toBe(true);
        });
        it("connects a method", () => {
            const receiver1 = {};
            const receiver2 = {};
            const slot = jest.fn();
            const signal = new Signal();
            expect(signal.isConnected(slot)).toBe(false);
            expect(signal.isConnected(slot, receiver1)).toBe(false);
            expect(signal.isConnected(slot, receiver2)).toBe(false);
            signal.connect(slot, receiver1);
            expect(signal.isConnected(slot)).toBe(false);
            expect(signal.isConnected(slot, receiver1)).toBe(true);
            expect(signal.isConnected(slot, receiver2)).toBe(false);
            signal.connect(slot, receiver2);
            expect(signal.isConnected(slot)).toBe(false);
            expect(signal.isConnected(slot, receiver1)).toBe(true);
            expect(signal.isConnected(slot, receiver2)).toBe(true);
        });
        it("connects function with matching parameters and ignored return value", () => {
            const slot = (a: number, b: string): string => b.repeat(a);
            const signal = new Signal<[ number, string ]>();
            signal.connect(slot);
            expect(signal.isConnected(slot)).toBe(true);
        });
        it("calls initializer function which is called when first slot is connected", () => {
            const initializer = jest.fn();
            const signal = new Signal(initializer);
            expect(initializer).not.toHaveBeenCalled();
            signal.connect(() => {});
            expect(initializer).toHaveBeenCalledOnce();
            expect(initializer).toHaveBeenCalledWith(signal);
            initializer.mockClear();
            signal.connect(() => {});
            expect(initializer).not.toHaveBeenCalled();
            signal.disconnect();
            signal.connect(() => {});
            expect(initializer).toHaveBeenCalledOnce();
            expect(initializer).toHaveBeenCalledWith(signal);
        });
    });
    describe("disconnect", () => {
        it("throws exception when disconnecting unconnected named function", () => {
            function slot1(): void {}
            const slot2 = (): void => {};
            const signal = new Signal();
            expect(() => signal.disconnect(slot1)).toThrowWithMessage(SignalException,
                "Slot 'slot1' is not connected");
            expect(() => signal.disconnect(slot2)).toThrowWithMessage(SignalException,
                "Slot 'slot2' is not connected");
        });
        it("throws exception when disconnecting unconnected anonymous function", () => {
            const signal = new Signal();
            expect(() => signal.disconnect(() => {})).toThrowWithMessage(SignalException,
                "Slot '<anonymous>' is not connected");
        });
        it("throws exception when disconnecting unconnected method", () => {
            class Test {
                public foo(): void {}
            }
            const signal = new Signal();
            const test = new Test();
            expect(() => signal.disconnect(test.foo, test)).toThrowWithMessage(SignalException,
                "Slot 'Test::foo' is not connected");
        });
        it("throws exception when connecting already connected anonymous method", () => {
            class Test {
                public foo(): void {}
            }
            const signal = new Signal();
            const test = new Test();
            expect(() => signal.disconnect(() => {}, test)).toThrowWithMessage(SignalException,
                "Slot 'Test::<anonymous>' is not connected");
        });
        it("disconnects connected function", () => {
            const slot = jest.fn();
            const signal = new Signal();
            signal.connect(slot);
            expect(signal.isConnected(slot)).toBe(true);
            signal.disconnect(slot);
            expect(signal.isConnected(slot)).toBe(false);
        });
        it("disconnects connected method", () => {
            const receiver1 = {};
            const receiver2 = {};
            const slot = jest.fn();
            const signal = new Signal();
            signal.connect(slot, receiver1);
            signal.connect(slot, receiver2);
            expect(signal.isConnected(slot, receiver1)).toBe(true);
            expect(signal.isConnected(slot, receiver2)).toBe(true);
            signal.disconnect(slot, receiver1);
            expect(signal.isConnected(slot, receiver1)).toBe(false);
            expect(signal.isConnected(slot, receiver2)).toBe(true);
            signal.disconnect(slot, receiver2);
            expect(signal.isConnected(slot, receiver1)).toBe(false);
            expect(signal.isConnected(slot, receiver2)).toBe(false);
        });
        it("does not disconnect methods when disconnecting the function the method binds to", () => {
            const receiver = {};
            const slot = jest.fn();
            const signal = new Signal();
            signal.connect(slot);
            signal.connect(slot, receiver);
            expect(signal.isConnected(slot)).toBe(true);
            expect(signal.isConnected(slot, receiver)).toBe(true);
            signal.disconnect(slot);
            expect(signal.isConnected(slot)).toBe(false);
            expect(signal.isConnected(slot, receiver)).toBe(true);
        });
        it("does not disconnect the unbound function when disconnecting a method", () => {
            const receiver = {};
            const slot = jest.fn();
            const signal = new Signal();
            signal.connect(slot);
            signal.connect(slot, receiver);
            expect(signal.isConnected(slot)).toBe(true);
            expect(signal.isConnected(slot, receiver)).toBe(true);
            signal.disconnect(slot, receiver);
            expect(signal.isConnected(slot)).toBe(true);
            expect(signal.isConnected(slot, receiver)).toBe(false);
        });
        it("disconnect all slots when called without parameters", () => {
            const receiver1 = {};
            const receiver2 = {};
            const slot = jest.fn();
            const signal = new Signal();
            signal.connect(slot);
            signal.connect(slot, receiver1);
            signal.connect(slot, receiver2);
            signal.disconnect();
            expect(signal.isConnected(slot, receiver1)).toBe(false);
            expect(signal.isConnected(slot, receiver2)).toBe(false);
            expect(signal.isConnected(slot)).toBe(false);
            expect(signal.isConnected()).toBe(false);
        });
        it("calls finalizer function which is called when last slot is disconnected", () => {
            const finalizer = jest.fn();
            const signal = new Signal(() => finalizer);
            const slot1 = jest.fn();
            const slot2 = jest.fn();
            signal.connect(slot1);
            signal.connect(slot2);
            expect(finalizer).not.toHaveBeenCalled();
            signal.disconnect(slot1);
            expect(finalizer).not.toHaveBeenCalled();
            signal.disconnect(slot2);
            expect(finalizer).toHaveBeenCalledOnce();
            finalizer.mockClear();
            signal.connect(slot1);
            signal.connect(slot2);
            expect(finalizer).not.toHaveBeenCalled();
            signal.disconnect();
            expect(finalizer).toHaveBeenCalledOnce();
        });
    });
    for (const method of [ "asObservable", "@@observable", Symbol.observable ] as const) {
        describe(typeof method === "string" ? method : "Symbol.observable", () => {
            describe("returns an observable connected to signal", () => {
                it("with no value", () => {
                    const signal = new Signal();
                    const observable = signal[method]();
                    const subscriber = jest.fn();
                    expect(signal.isConnected()).toBe(false);
                    const subscription = observable.subscribe(subscriber);
                    expect(signal.isConnected()).toBe(true);
                    signal();
                    expect(subscriber).toHaveBeenCalledOnce();
                    subscriber.mockClear();
                    subscription.unsubscribe();
                    expect(signal.isConnected()).toBe(false);
                    signal();
                    expect(subscriber).not.toHaveBeenCalledOnce();
                });
                it("with single value", () => {
                    const signal = new Signal<[ number ]>();
                    const observable = signal[method]();
                    const subscriber = jest.fn((a: number) => {});
                    expect(signal.isConnected()).toBe(false);
                    const subscription = observable.subscribe(subscriber);
                    expect(signal.isConnected()).toBe(true);
                    signal(42);
                    expect(subscriber).toHaveBeenCalledOnce();
                    expect(subscriber).toHaveBeenCalledWith(42);
                    subscriber.mockClear();
                    subscription.unsubscribe();
                    expect(signal.isConnected()).toBe(false);
                    signal(2);
                    expect(subscriber).not.toHaveBeenCalledOnce();
                });
                it("with multiple value", () => {
                    const signal = new Signal<[ number, string[] ]>();
                    const observable = signal[method]();
                    const subscriber = jest.fn((args: [ number, string[] ]) => {});
                    expect(signal.isConnected()).toBe(false);
                    const subscription = observable.subscribe(subscriber);
                    expect(signal.isConnected()).toBe(true);
                    signal(42, [ "foo", "bar" ]);
                    expect(subscriber).toHaveBeenCalledOnce();
                    expect(subscriber).toHaveBeenCalledWith([ 42, [ "foo", "bar" ] ]);
                    subscriber.mockClear();
                    subscription.unsubscribe();
                    expect(signal.isConnected()).toBe(false);
                    signal(2, [ "foo" ]);
                    expect(subscriber).not.toHaveBeenCalledOnce();
                });
            });
        });
    }
});
