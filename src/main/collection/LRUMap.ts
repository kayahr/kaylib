/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

class LRUMapEntry<K, V> {
    public constructor(
        public readonly key: K,
        public readonly value: V,
        public previous: LRUMapEntry<K, V> | null = null,
        public next: LRUMapEntry<K, V> | null = null
    ) {}
}

/**
 * Last-recently used map with a defined maximum size. Can be used for limited caches which automatically removes
 * least-used items from the map when it reaches the maximum size.
 */
export class LRUMap<K, V> implements Map<K, V> {
    private first: LRUMapEntry<K, V> | null = null;
    private last: LRUMapEntry<K, V> | null = null;
    private readonly index = new Map<K, LRUMapEntry<K, V>>();
    private readonly maxSize: number;

    /**
     * Creates a new LRU map.
     *
     * @param maxSize - The maximum number of entries in the map.
     * @param entries - Optional initial map entries.
     */
    public constructor(maxSize: number, entries?: ReadonlyArray<[K, V]> | null) {
        this.maxSize = maxSize;
        if (entries) {
            for (const entry of entries) {
                this.set(entry[0], entry[1]);
            }
        }
    }

    /** @inheritDoc */
    public get [Symbol.toStringTag](): string {
        return "LRUMap";
    }

    /** @inheritDoc */
    public clear(): void {
        this.index.clear();
        this.first = this.last = null;
    }

    /** @inheritDoc */
    public delete(key: K): boolean {
        const entry = this.index.get(key);
        if (entry) {
            if (this.last === entry) {
                this.last = entry.previous;
            }
            if (this.first === entry) {
                this.first = entry.next;
            }
            if (entry.previous) {
                entry.previous.next = entry.next;
            }
            if (entry.next) {
                entry.next.previous = entry.previous;
            }
            this.index.delete(key);
            return true;
        }
        return false;
    }

    /** @inheritDoc */
    public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: unknown): void {
        let entry: LRUMapEntry<K, V> | null = this.first;
        while (entry) {
            const next = entry.next;
            callbackfn.call(thisArg, entry.value, entry.key, this);
            entry = next;
        }
    }

    private touch(entry: LRUMapEntry<K, V>): void {
        if (this.last && this.last !== entry) {
            if (entry.previous) {
                entry.previous.next = entry.next;
            }
            entry.previous = this.last;
            entry.next = null;
            this.last.next = entry;
            this.last = entry;
        }
    }

    private cleanup(): void {
        let overflow = this.size - this.maxSize;
        while (this.first && overflow > 0) {
            this.index.delete(this.first.key);
            this.first = this.first.next;
            if (this.first) {
                this.first.previous = null;
            }
            overflow--;
        }
    }

    /** @inheritDoc */
    public get(key: K): V | undefined {
        const entry = this.index.get(key);
        if (entry) {
            this.touch(entry);
            return entry.value;
        }
        return undefined;
    }

    /** @inheritDoc */
    public has(key: K): boolean {
        const entry = this.index.get(key);
        if (entry) {
            this.touch(entry);
            return true;
        }
        return false;
    }

    /** @inheritDoc */
    public set(key: K, value: V): this {
        this.delete(key);
        const entry = new LRUMapEntry(key, value, this.last);
        if (this.last) {
            this.last.next = entry;
        }
        if (!this.first) {
            this.first = entry;
        }
        this.last = entry;
        this.index.set(key, entry);
        this.cleanup();
        return this;
    }

    /** @inheritDoc */
    public get size(): number {
        return this.index.size;
    }

    /** @inheritDoc */
    public *[Symbol.iterator](): IterableIterator<[K, V]> {
        let entry: LRUMapEntry<K, V> | null = this.first;
        while (entry) {
            const next = entry.next;
            yield [ entry.key, entry.value ];
            entry = next;
        }
    }

    /** @inheritDoc */
    public *entries(): IterableIterator<[K, V]> {
        let entry: LRUMapEntry<K, V> | null = this.first;
        while (entry) {
            const next = entry.next;
            yield [ entry.key, entry.value ];
            entry = next;
        }
    }

    /** @inheritDoc */
    public *keys(): IterableIterator<K> {
        let entry: LRUMapEntry<K, V> | null = this.first;
        while (entry) {
            const next = entry.next;
            yield entry.key;
            entry = next;
        }
    }

    /** @inheritDoc */
    public *values(): IterableIterator<V> {
        let entry: LRUMapEntry<K, V> | null = this.first;
        while (entry) {
            const next = entry.next;
            yield entry.value;
            entry = next;
        }
    }
}
