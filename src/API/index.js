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

export function loginReq(mobile,password){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/login',
        method: 'POST',
        data: {
            mobile: mobile,
            password: password
        }
    })
}

// 发送保存的乘客的信息
export function saveStation(station){
    //http://localhost:8090/api/
    return request({
        url: '//business/admin/station/save',
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
        url: '/business/admin/station/query_list',
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

/**
 * 删除管理员信息
 * @param record
 * @returns {*}
 */
export function deleteStation(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/station/delete/'+record.id,
        method: 'DELETE',
    })
}


/**
 * 保存、更新管理员信息
 * @param admin
 * @returns {*}
 */
export function saveAdmin(admin){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/save',
        method: 'POST',
        data:{
            ...admin
        }
    })
}

export function deleteAdmin(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/delete/'+record.id,
        method: 'DELETE',
    })
}

/**
 * 查询管理员
 * @param page
 * @param size
 * @returns {*}
 */
export function getAdmin(page,size){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/query_list',
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
