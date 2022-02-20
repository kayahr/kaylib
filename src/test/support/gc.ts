/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { sleep } from "../../main/util/time";

export async function garbageCollect(): Promise<void> {
    await sleep(0);
    if (gc != null) {
        gc();
    }
    await sleep(0);
}
