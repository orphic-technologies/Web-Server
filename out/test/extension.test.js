"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const browserSync = require("browser-sync");
const server_1 = require("../src/server");
suite("Server Tests", () => {
    test("start server", () => {
        server_1.Server.start(".", 8888, true);
        assert.ok(browserSync.has("preview-server"));
        server_1.Server.stop();
    });
});
//# sourceMappingURL=extension.test.js.map