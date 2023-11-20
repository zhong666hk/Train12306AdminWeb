import {request} from "@/config/Axios";
//每一个请求都被封装为一个实例

export function getCode(mobile){
    //http://localhost:8090/api/
    return request({
        url: '/member/sendCode',
        method: 'POST',
        data: {
            mobile: mobile,
        }
    })
}

export function loginReq(mobile,code){
    //http://localhost:8090/api/
    return request({
        url: '/member/login',
        method: 'POST',
        data: {
            mobile: mobile,
            code: code
        }
    })
}

// 发送保存的乘客的信息
export function saveStation(station){
    //http://localhost:8090/api/
    return request({
        url: '/station/save',
        method: 'POST',
        data:{
            ...station
        }
    })
}

/**
 * 查询passengers
 * @param page 当前页
 * @param size 页面的大小
 */
export function getStations(page,size){
    //http://localhost:8090/api/
    return request({
        url: 'station/query_list',
        method: 'GET',
        params:{
            page,
            size,
        },
    },{transformResponse: [
            function (data){
                return data;
            }
        ]})
}

export function deleteStation(record){
    //http://localhost:8090/api/
    return request({
        url: 'station/delete/'+record.id,
        method: 'DELETE',
    })
}

