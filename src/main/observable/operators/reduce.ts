import { Observable } from "../Observable";
import { SubscribableOperator } from "../SubscribableOperator";

export function reduce<T, R>(acc: (result: R, value: T, index: number) => R, seed: R): SubscribableOperator<T, R> {
    return source => new Observable(observer => {
        let result = seed;
        let index = 0;
        return source.subscribe({
            next(value: T) {
                result = acc(result, value, index++);
            },
            complete() {
                observer.next(result);
                observer.complete();
            },
            error(e: Error) {
                observer.error(e);
            }
        });
    });
}
