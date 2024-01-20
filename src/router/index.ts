import { createRouter, createWebHistory } from "vue-router";
import { useLoaderState } from '@/store/isloading'
import routes from '@/router/routes'

//动态路由 读取webapi数据
const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    const isLoading = useLoaderState();
    const { changeStateTrue } = isLoading;


    changeStateTrue();

    // setTimeout(() => {
    next();
    // }, 500);
});

router.afterEach((to, from) => {
    const isLoading = useLoaderState();
    const { changeStateFalse } = isLoading;

    changeStateFalse();
});

export default router
