type Observer = () => void;

export class ObservableStorage<T> {
    private readonly storage: T[];
    private readonly observers: Observer[];
    constructor() {
        this.storage = [];
        this.observers = [];
    }

    /**
     * push adds new item to storage and calls all observers.
     */
    public push(...items: T[]) {
        this.storage.push(...items);
        for (const observer of this.observers) {
            observer();
        }
    }

    /**
     * [Symbol.iterator] allows us to iterate instances of this class.
     */
    public *[Symbol.iterator]() {
        for (const value of this.storage) {
            yield value;
        }
    }

    /**
     * AddObserver adds an observer to observers list.
     */
    public AddObserver(observer: Observer) {
        this.observers.push(observer);
    }

    /**
     * get returns item by index.
     */
    public get(index: number): T {
        return this.storage[index];
    }
}
