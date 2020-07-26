import "source-map-support/register";

import { getStackTrace, IllegalArgumentException, IllegalStateException } from "../main/exception";

function test(): void {
    throw new IllegalArgumentException("Error 1");
}

function test2(): void {
    try {
        test();
    } catch (e) {
        throw new IllegalStateException("Error 2", e);
    }
}

try {
    test2();
} catch (e) {
    console.log(getStackTrace(e));
}
