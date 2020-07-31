/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import { runTests as runObservableTests } from "es-observable-tests";

import { Observable } from "../../main/observable/Observable";

describe("Observable", () => {
    it("passes the official es-observable-tests test suite", async () => {
        let output = "";
        const origLog = console.log;
        console.log = (s: string) => { output += s + "\n"; };
        const result = await runObservableTests(Observable);
        console.log = origLog;
        if (result.logger.failed > 0 || result.logger.errored > 0) {
            throw new Error(`Test suite found ${result.logger.failed} failures and ${result.logger.errored} errors: `
                + output);
        }
    });
});
