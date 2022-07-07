import axios from "axios";
import { Message } from "element-ui";
import router from "../router";

// 请求拦截器
axios.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    if (sessionStorage.getItem("tokenStr")) {
        config.headers['Authorization'] = window.sessionStorage.getItem("tokenStr");
    }
    return config;
}, error => {
    // 对请求错误做些什么
    console.log(error);
})


// 响应拦截器
axios.interceptors.response.use(success => {
    // 连接成功
    if (success.status && success.status == 200) {
        if (success.data.code >= 500 || success.data.code >= 400 && success.data.code <= 499) {
            Message.error({ message: success.data.msg });
            return;
        }
        else if (success.data.msg) {
            Message.success({ message: success.data.msg });
        }
    }
    return success.data;
}, error => {
    // 连接失败
    if (error.response.code == 404 || error.response.code == 504) {
        Message.error({ message: "服务器挂了，请稍后再试！" });
    } else if (error.response.code == 403) {
        Message.error({ message: "权限不足，请联系管理员！" });
    } else if (error.response.code == 401) {
        Message.error({ message: "尚未登录，请先登录!!!!!!!!!!!!!!!!!！" });
        setTimeout(() => {
            router.replace("/");
        }, 1000);
    } else {
        if (error.response.data.msg) {
            Message.error({ message: error.response.data.msg });
        } else {
            Message.error({ message: " 未知错误！" });
        }
    }
    return;
});

let base = ''

// POST请求
export const postRequest = function (url, data) {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: data
    })
}
// GET请求
export const getRequest = function (url, params) {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params
    })
}

// PUT请求
export const putRequest = function (url, data) {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: data
    })
}

// DELETE请求
export const deleteRequest = function (url, params) {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        params: params
    })
}

// 批量删除按钮
export const batchDeleteRequest = function (url, data) {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: data
    })
}

// 文件上传请求
export const uploadRequest = function (url, data) {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: data,
        dataType: 'multipart/form-data',
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}


