import Vue from "vue";
import Router from "vue-router";
import { createRoutes } from "./routes";

Vue.use(Router);

// create router
const router: Router = new Router({ mode: "hash" });
router.addRoutes(createRoutes(router));

export default router;
