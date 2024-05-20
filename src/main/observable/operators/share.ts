import { SharedObservable } from "../SharedObservable";
import { SubscribableOperator } from "../SubscribableOperator";

export function share<T>(): SubscribableOperator<T> {
    return source => new SharedObservable(observer => source.subscribe(observer));
}
