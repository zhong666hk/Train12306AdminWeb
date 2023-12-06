import {request} from "@/config/Axios";
//每一个请求都被封装为一个实例

//============================登录======================
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
//==============================车站==========================

// 发送保存的车站的信息
export function saveStation(station){
    //http://localhost:8090/api/
    return request({
        url: '/business/station/save',
        method: 'POST',
        data:{
            ...station
        }
    })
}

/**
 * 查询车站
 * @param page 当前页
 * @param size 页面的大小
 */
export function getStations(page,size){
    //http://localhost:8090/api/
    return request({
        url: '/business/station/query_list',
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
 * 删除车站信息
 * @param record
 * @returns {*}
 */
export function deleteStation(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/station/delete/'+record.id,
        method: 'DELETE',
    })
}

//==================================管理员========================
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
//=========================================火车==================
/** 火车
 *
 * @param page
 * @param size
 * @returns {*}
 */
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

/**
 * 自动生成当前车次的座位
 * @param record
 * @returns {*}
 */
export function genTrainSeat(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/train/gen/'+record.code,
        method: 'GET',
    })
}

/**
 * 查询所有火车所有信息
 * @returns {*}
 */
export function queryAllTrain(){
    //http://localhost:8090/api/
    return request({
        url: '/business/train/query_all',
        method: 'GET',

    })
}

// =================================火车车站===========================

/**
 * 查询所有火车站台所有信息
 * @returns {*}
 */
export function queryAllStation(){
    //http://localhost:8090/api/
    return request({
        url: '/business/station/query_all',
        method: 'GET',

    })
}

export function getTrainStation(page,size,params){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_station/query_list',
        method: 'GET',
        params:{
            page,
            size,
            ...params,
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

// =======================================火车车厢=========================
export function getTrainCarriage(page,size,params){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_carriage/query_list',
        method: 'GET',
        params:{
            page,
            size,
            ...params
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

// =========================================火车座位=====================

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
export function getTrainSeat(page,size,params){
    //http://localhost:8090/api/
    return request({
        url: '/business/train_seat/query_list',
        method: 'GET',
        params:{
            page,
            size,
            ...params,
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


// ===========================定时任务=====================

/**
 * 保存、更新定时任务
 * @param url
 * @param job
 * @returns {*}
 */
export function saveJob(url,job){
    //http://localhost:8090/api/
    return request({
        url: url,
        method: 'POST',
        data:{
            ...job
        }
    })
}

// 火车座位
export function getJobs(){
    //http://localhost:8090/api/
    return request({
        url: '/batch/job/query',
        method: 'GET',
    },{transformResponse: [
            function (data){
                return data;
            }
        ]})
}

export function deleteJob(record){
    //http://localhost:8090/api/
    return request({
        url: '/batch/job/delete',
        method: 'POST',
        data:{
            name: record.name,
            group: record.group
        }
    })
}
export function pauseJob(record){
    //http://localhost:8090/api/
    return request({
        url: '/batch/job/pause',
        method: 'POST',
        data:{
            name: record.name,
            group: record.group
        }
    })
}
// 重启
export function resumeJob(record){
    //http://localhost:8090/api/
    return request({
        url: '/batch/job/reschedule',
        method: 'POST',
        data:{
            ...record
        }
    })
}

export function runJob(record){
    //http://localhost:8090/api/
    return request({
        url: '/batch/job/run',
        method: 'POST',
        data:{
            ...record
        }
    })
}

// =========================================当天车次=====================

/**
 * 保存、更新火车座位信息
 * @param train
 * @returns {*}
 */
export function saveDailyTrain(train){
    //http://localhost:8090/api/
    return request({
        url: '/business/daily_train/save',
        method: 'POST',
        data:{
            ...train
        }
    })
}

// 火车座位
export function getDailyTrain(page,size,params){
    //http://localhost:8090/api/
    return request({
        url: '/business/daily_train/query_list',
        method: 'GET',
        params:{
            page,
            size,
            ...params,
        },
    },{transformResponse: [
            function (data){
                return data;
            }
        ]})
}

export function deleteDailyTrain(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/daily_train/delete/'+record.id,
        method: 'DELETE',
    })
}


// =========================================当天车站=====================

/**
 * 保存、更新火车车站信息
 * @param train
 * @returns {*}
 */
export function saveDailyTrainStation(train){
    //http://localhost:8090/api/
    return request({
        url: '/business/daily_train_station/save',
        method: 'POST',
        data:{
            ...train
        }
    })
}

// 火车座位
export function getDailyTrainStation(page,size,params){
    //http://localhost:8090/api/
    return request({
        url: '/business/daily_train_station/query_list',
        method: 'GET',
        params:{
            page,
            size,
            ...params,
        },
    },{transformResponse: [
            function (data){
                return data;
            }
        ]})
}

export function deleteDailyTrainStation(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/daily_train_station/delete/'+record.id,
        method: 'DELETE',
    })
}
