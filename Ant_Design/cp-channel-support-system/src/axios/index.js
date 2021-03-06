import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd'
import Utils from '../utils/utils'
export default class Axios {

    static requestList(_this,url,params,isMock){
        var data = {
            params: params,
            isMock
        }
        this.ajax_post({
            url,
            data
        }).then((data)=>{
       
            if (data && data.result){
                let list = data.result.itemList.map((item, index) => {
                    item.key = index;
                    return item;
                });
              
                _this.setState({
                    list,
                    pagination: Utils.pagination(data, (current,pageSize) => {
                        _this.params.page = current;
                        _this.params.pageSize = pageSize;
                        _this.requestList();
                    },(current,pageSize) => {
                        _this.params.page = current;
                        _this.params.pageSize = pageSize;
                        _this.requestList();
                    })
                })
            }
        });
    }


    static requestSelect(_this,url,params,isMock,name){
        var data = {
            params: params,
            isMock
        }
        this.ajax_post({
            url,
            data
        }).then((data)=>{
       
            if (data && data.result){
                let list = data.result.itemList;
                _this.setState({
                [name] :list
                })
            }
        });
    }


    static jsonp(options) {
        return new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                if (response.status == 'success') {
                    resolve(response);
                } else {
                    reject(response.messsage);
                }
            })
        })
    }




    static ajax_post(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        let baseApi = '';
        if(options.isMock){
          //  baseApi = 'http://172.16.3.34:7300/mock/5c8b52301c146e070a90cd46/example';
        }else{
           // baseApi = 'http://172.16.3.34:7300/mock/5c8b52301c146e070a90cd46/example';
        }
        return new Promise((resolve,reject)=>{
            axios.post(baseApi+options.url ,(options.data && options.data.params) || {}).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    if (res.code == '0'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            }).catch( (error)=> {
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                Modal.error({
                    title:"加载失败!",
                    content:"加载失败!"
                })
              })
        });
    }
    

    static ajax(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        let baseApi = '';
        if(options.isMock){
            baseApi = 'http://172.16.3.34:7300/mock/5c8b52301c146e070a90cd46/example';
        }else{
            baseApi = 'http://172.16.3.34:7300/mock/5c8b52301c146e070a90cd46/example';
        }
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'get',
                baseURL:baseApi,
                timeout:5000,
                params: (options.data && options.data.params) || ''
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    if (res.code == '0'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            }).catch( (error)=> {
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                Modal.error({
                    title:"加载失败!",
                    content:"加载失败!"
                })
              })
        });
    }
}