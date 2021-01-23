import { default as Router, RouteConfig } from "vue-router";

export function createRoutes(router: Router): RouteConfig[] {
  return [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue")
    },
    {
      path: "/experience",
      name: "experience",
      component: () => import("../views/Experience.vue")
    },
    {
        path: "/work",
        name: "work",
        component: () => import("../views/Work.vue")
    },
    {
        path: "/contact",
        name: "contact",
        component: () => import("../views/Contact.vue")
    },
    {
      path: "/404",
      name: "not-found",
      component: () => import(/* webpackChunkName: 'not-found' */ "../views/NotFound.vue")
    },
    {
      path: "/*",
      redirect: "/404"
    }
  ];
}
