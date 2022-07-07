import axios from "axios";

const service = axios.create({
    responseType: "arraybuffer"
});

service.interceptors.request.use(
    config => {
        config.headers["Authorization"] = window.sessionStorage.getItem("tokenStr");
        return config;
    }, error => {
        console.log(error);
    });

service.interceptors.response.use(
    response => {
        const headers = response.headers;
        let reg = RegExp(/application\/json/i);
        if (headers["content-type"].match(reg)) {
            resp.data = unitToString(response.data);
        } else {
            let fileDownload = require("js-file-download");
            let fileName = headers["content-disposition"].split(";")[1].split("=")[1];
            let contentType = headers["content-type"];
            fileName = decodeURIComponent(fileName);
            fileDownload(response.data, fileName, contentType);
        }
    }, error => {
        console.log(error);
    }
)


function unitToString(data) {
    // 编码
    let encodeString = String.fromCharCode.apply(null, new Uint8Array(data));
    // 解码
    let decodeString = decodeURIComponent(escape(encodeString));
    return JSON.parse(decodeString);

}

let base = "";
export const downloadRequest = function (url, data) {
    return service({
        method: "get",
        url: `${base}${url}`,
        data: data
    })
}

export default service;