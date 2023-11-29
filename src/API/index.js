import {request} from "@/config/Axios";
//每一个请求都被封装为一个实例


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

export function registerReq(mobile,password){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/register',
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
        url: '/business/admin/station/save',
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

// 火车
export function getTrain(page,size){
    //http://localhost:8090/api/
    return request({
        url: '/business/train/query_list',
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

export function deleteTrain(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/train/delete/'+record.id,
        method: 'DELETE',
    })
}

/**
 * 保存、更新火车信息
 * @param train
 * @returns {*}
 */
export function saveTrain(train){
    //http://localhost:8090/api/
    return request({
        url: '/business/train/save',
        method: 'POST',
        data:{
            ...train
        }
    })
}

// 火车车站
export function getTrainStation(page,size){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_station/query_list',
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

export function deleteTrainStation(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_station/delete/'+record.id,
        method: 'DELETE',
    })
}

/**
 * 保存、更新火车车站信息
 * @param trainStation
 * @returns {*}
 */
export function saveTrainStation(trainStation){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_station/save',
        method: 'POST',
        data:{
            ...trainStation
        }
    })
}

// 火车车厢
export function getTrainCarriage(page,size){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_carriage/query_list',
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

export function deleteTrainCarriage(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_carriage/delete/'+record.id,
        method: 'DELETE',
    })
}

/**
 * 保存、更新火车车厢信息
 * @param trainCarriage
 * @returns {*}
 */
export function saveTrainCarriage(trainCarriage){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_carriage/save',
        method: 'POST',
        data:{
            ...trainCarriage
        }
    })
}

// ----------------------

/**
 * 保存、更新火车座位信息
 * @param seat
 * @returns {*}
 */
export function saveTrainSeat(seat){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_seat/save',
        method: 'POST',
        data:{
            ...seat
        }
    })
}

// 火车座位
export function getTrainSeat(page,size){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_seat/query_list',
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

export function deleteTrainSeat(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_seat/delete/'+record.id,
        method: 'DELETE',
    })
}

