Dependency Injection
====================

Basic usage
-----------

To make a class injectable you have to mark it with the `@injectable` decorator like this:

```typescript
import { injectable } from "@kayahr/kaylib/lib/main/di/Injectable";

@injectable
class FooService {
    public foo(): number {
        return 53;
    }
}
```

Injectables can then be automatically injected into constructors of other injectables like this:

```typescript
@injectable
class BarService {
    public constructor(private fooService: FooService) {}

    public bar(): number {
        return this.fooService.foo() * 3;
    }
}
```

It is also possible to inject dependencies into static factory methods instead of using the constructor. For this you have to specify the `@injectable` decorator on the factory method instead like this:

```typescript
class BarService {
    private constructor(private fooValue: number) {}

    @injectable
    public static create(fooService: FooService): BarService {
        return new BarService(fooService.foo());
    }

    public bar(): number {
        return this.fooValue * 3;
    }
}
```

At the root level of your application you need to have an entry point into the whole dependency tree. For this you have to fetch the root dependency directly from the injector. This is done by passing the requested type to the `getSync()` method of the injector:

```typescript
import { injector } from "@kayahr/kaylib/lib/main/di/Injector";

const app = injector.getSync(Application);
app.start();
```

You may wonder why the method is named `getSync` and not just `get`. This is because the dependency injection frameworks supports asynchronous creation of injectables. But when you already know that you don't have asynchronous dependencies then you can simply use `getSync()` so you don't have to deal with promises.

Asynchronous dependencies
-------------------------

Injectables can be created asynchronously by using a static factory method which returns the created instance through a `Promise`:

```typescript
class UserService {
    private constructor(private db: Database) {}

    @injectable
    public static async create(): Promise<UserService> {
        const db = await createDatabase();
        return new UserService(db);
    }

    public getUserNames(): string[] {
        return this.db.queryAll("SELECT name FROM users");
    }
}
```

Asynchronous dependencies can be directly injected into any other injectable as usual but this dependency then also becomes an asynchronous dependency because the injector first waits for the creation of all dependencies before the injectable needing these dependencies is created.

At the root level `injector.getSync()` will throw an exception when it encounters an asynchronous dependency. You have to use `injector.get()` or `injector.getAsync()` instead. The difference between the two is that `get()` returns the dependency directly when it is not asynchronous or it returns a Promise otherwise while `getAsync()` always returns a promise. Usually it is best to simply use `await injector.get()` because `await` works with promises and direct values. Use `getAsync()` only if you definitely want a Promise for some reason no matter if asynchronous dependency are used or not.

Dependency names
----------------

Sometimes there are multiple services implementing the same base class or interface so dependency resolution must know which one of the found dependencies should be used. For this you can use qualifier names which are simply strings referenced by an injectable and which then can be used for injecting the dependency:

```typescript
interface FooService {
    foo(): number;
}

@injectable("foo1")
class FooService1 implements FooService {
    public foo(): number {
        return 1;
    }
}

@injectable("foo2")
class FooService2 implements FooService {
    public foo(): number {
        return 2;
    }
}
```

So there are two services implementing the same interface. When trying to inject it into some other injectable by just the base type this can't work because multiple services are found. Actually injecting a dependency by interface can't work at all because interfaces are a compile-time thing and resolve to a generic Object type during runtime. So to inject the correct service you have to specify the qualifier name of the service:

```typescript
import { qualifier } from "@kayahr/kaylib/lib/main/di/Qualifier";

@injectable
class BarService {
    public constructor(@qualifier("foo1") private fooService: FooService) {}
}
```

Injectables can have multiple qualifier names and you can do some fancy dependency selection like this with it:

```typescript
@injectable
class BarService {
    public constructor(@qualifier("foo1").andNot("disabled") readonly fooService: FooService) {}
}
```

At root level qualifier names can also be used when getting a dependency directly from the injector:

```typescript
const fooService = injector.getSync<FooService>("foo1");
```

Or with fancy dependency selection:

```typescript
const fooService = injector.getSync<FooService>(qualifier("foo1").andNot("disabled"));
```

Note that you have to use type casting in these examples because typescript cannot infer the type from just qualifier names. The same actually is true for automatic dependency injection when using interfaces because during runtime the injector can't ensure the type because interface types are just generic Object types during runtime. So when just injecting by qualifier name you may accidentally inject a wrong type which creates runtime errors and the compiler can't detect this type mismatch. To prevent this you might want to use abstract base classes instead of interfaces because these types can be checked during runtime.


Manually injecting dependencies
-------------------------------

You can manually inject any kind of data which then can be resolved by type and/or qualifier names. You can use this for example to inject configuration values into a service like this:

```typescript
@injectable
class FooService {
    public constructor(@qualifier("configFile") configFile: string) {}
}

injector.injectValue("foo.conf", "configFile");
```
