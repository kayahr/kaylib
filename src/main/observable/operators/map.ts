import { Observable } from "../Observable";
import { SubscribableOperator } from "../SubscribableOperator";

export function map<T, R>(mapper: (value: T, index: number) => R, thisArg?: unknown): SubscribableOperator<T, R> {
    return subscribable => new Observable(observer => {
        let index = 0;
        return subscribable.subscribe({
            next(value: T) {
                observer.next(mapper(value, index++));
            },
            complete() {
                observer.complete();
            },
            error(e: Error) {
                observer.error(e);
            }
        });
    });
}
