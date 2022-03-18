import { Subscribable } from "./Subscribable";

export type SubscribableOperator<T, R = T> = (arg: Subscribable<T>) => Subscribable<R>;
