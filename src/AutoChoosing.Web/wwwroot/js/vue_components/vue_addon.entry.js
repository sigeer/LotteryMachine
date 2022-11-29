import test from "./test.vue"

export default {
    install: (app, options) => {
        app.component("test", test);
    }
}