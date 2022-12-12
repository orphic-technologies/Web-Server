"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browserSync = require("browser-sync");
class Server {
    static start(rootPath, port, isSync, proxy = "", ui = null) {
        // get browserSync instance.
        let bs;
        if (!browserSync.has("Gryffin's server")) {
            bs = browserSync.create("Gryffin's server");
        }
        else {
            bs = browserSync.get("Gryffin's server");
        }
        let options;
        if (proxy === "") {
            options = {
                server: {
                    baseDir: rootPath,
                    directory: true
                },
                open: false,
                port: port,
                codeSync: isSync
            };
        }
        else {
            options = {
                proxy: proxy,
                serveStatic: ["."]
            };
        }
        if (ui.port && ui.weinrePort) {
            options.ui = {
                port: ui.port,
                weinre: {
                    port: ui.weinrePort
                }
            };
        }
        bs.init(options, (err) => {
            if (err) {
                console.log(err);
                bs.notify("Error is occured.");
            }
        });
    }
    static stop() {
        if (browserSync.has("Gryffin's server")) {
            browserSync.get("Gryffin's server").exit();
        }
    }
    static reload(fileName) {
        if (browserSync.has("Gryffin's server")) {
            browserSync.get("Gryffin's server").reload(fileName);
        }
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map