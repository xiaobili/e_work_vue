import { getRequest } from "./api";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/system/cfg/menu").then(res => {
        if (res) {
            // 格式化Router
            let formatRoutes = formatRoutesData(res);
            // 添加路由
            router.addRoutes(formatRoutes);
            // 更新路由
            store.commit("initRoutes", formatRoutes);

        }
    });
}


export const formatRoutesData = (data) => {
    let routes = [];
    // 遍历路由
    data.forEach(item => {
        let {
            path,
            component,
            name,
            iconcls,
            children,
        } = item;
        if (children && children instanceof Array) {
            children = formatRoutesData(children);
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconcls,
            children: children,
            component(resolve) {
                if (component.startsWith('Home')) {
                    require(['../view/' + component], resolve);
                }
                if (component.startsWith('Emp')) {
                    require([`@/view/emp/${component}`], resolve);
                }
                else if (component.startsWith('Sys')) {
                    require([`@/view/sys/${component}`], resolve);
                }
                else if (component.startsWith('Sta')) {
                    require([`@/view/sta/${component}`], resolve);
                }
                else if (component.startsWith('Sal')) {
                    require([`@/view/sal/${component}`], resolve);
                }
                else if (component.startsWith('Per')) {
                    require([`@/view/per/${component}`], resolve);
                }
            }
        }
        // 添加路由
        routes.push(fmRouter);
    })
    return routes;
}