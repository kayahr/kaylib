import { Observable } from "../Observable";
import { SubscribableOperator } from "../SubscribableOperator";

export function filter<T>(predicate: (value: T, index: number) => boolean): SubscribableOperator<T> {
    return source => new Observable(observer => {
        let index = 0;
        return source.subscribe({
            next(value: T) {
                if (predicate(value, index++)) {
                    observer.next(value);
                }
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
