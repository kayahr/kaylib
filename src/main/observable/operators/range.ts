import { Observable } from "../Observable";
import { Subscribable } from "../Subscribable";

export function range(start: number, count: number): Subscribable<number> {
    return new Observable(observer => {
        const end = start + count;
        let current = start;
        while (current < end) {
            observer.next(current++);
        }
        observer.complete();
    });
}
