import React, { Component } from 'react'

import { Card, message, Form, Input, Button, Table, Icon, Divider, Modal, Tag } from 'antd'
import BaseForm from './../../components/BaseForm/'
import axios from '../../axios'
export default class SumVolumeProvince extends Component {
    state = {
        list: [],
        isVisible: false,
        filtered: null,
        sorted: null,
    }
    params = {
        page: 1,
        pageSize: 20
    }

    componentWillMount(){
        this.requestSelect();
   }

   requestSelect = () => {
       let _this = this;
       axios.requestSelect(_this, '/common/getProvinceList',"","", "provinceList");
       axios.requestSelect(_this, '/common/getCityList', "", "","cityList");
   }

    handleChange = (pagination, filters, sorter) => {
        console.info('Various parameters', pagination, filters, sorter);

        this.params.filtered = filters;
        this.params.sorted = sorter;

        this.requestList();
    }

    

    //接收baseForm 组件表单中的查询参数
    handleFilter = (params) => {
         this.params.provider = params.provider;
         this.params.appId = params.appId;
         this.params.businessName = params.businessName;
         this.params.price = params.price;
         this.params.shieldCity = params.shieldCity;
         this.params.province = params.province;
         this.params.codeProcee = params.codeProcee;
         this.params.merchantName=params.merchantName;
        this.requestList();
    }




    componentDidMount() {
        this.requestList();
    }

    requestList = () => {
        let _this = this;
        axios.requestList(_this, '/admin/getVolumeProvinceSumList', this.params, true);
    }

    render() {
        const formList = [
            {
                type: 'INPUT',
                label: '商户名称',
                field: 'merchantName',
                width: 200,
                placeholder: '请输入查询的商户名称'
            }, {
                type: 'SELECT',
                label: '运营商',
                field: 'provider',
                placeholder: '请选择查询的运营商',
                width: 200,
                list: [{ key: 0, value: '移动' }, { key: 1, value: '联通' }, { key: 2, value: '电信' }]
            }, {
                type: 'INPUT',
                label: 'AppId',
                field: 'appId',
                width: 200,
                placeholder: '请输入查询的AppId'
            }, {
                type: 'INPUT',
                label: '业务名称',
                field: 'businessName',
                width: 200,
                placeholder: '请输入查询的业务名称'
            }
            , {
                type: 'INPUTNUMBER',
                label: '价格',
                field: 'price',
                width: 200,
                placeholder: '请输入查询的价格'
            }
            ,   {
                type: 'CASCADER',
                label: '屏蔽地市',
                field: 'shieldCity',
                width: 200,
                placeholder: '请选择查询的屏蔽地级市',
                list:this.state.cityList
            }
            , {
                type: 'SELECT',
                label: '省份',
                field: 'province',
                width: 200,
                placeholder: '请选择查询的省份',
                list:this.state.provinceList
            }
            , {
                type: 'INPUT',
                label: '代码流程',
                placeholder: '请输入查询的代码流程',
                field: 'codeProcess',
                width: 200,
              
            }
        ]

        //设置列名
        const columns = [, {
            title: '商户名称(商户号)',
            dataIndex: 'merchantName',
            key: 'merchantName',
            width: 120,
            render: (text, record) => (
                <span>
                    {record.merchantName}{record.merchantNo}
                </span>

            )
        }, {
            title: '运营商',
            dataIndex: 'provider',
            key: 'provider',
            width: 80,
            render(provider) {
                return {
                    '0': '移动',
                    '1': '联通',
                    '2': '电信'
                }[provider]

            }
        }, {
            title: '业务名称',
            dataIndex: 'businessName',
            key: 'businessName',
            width: 80
        }, {
            title: 'AppId',
            dataIndex: 'appId',
            key: 'appId',
            width: 80
        }, 
    
         {
            title: '价格(元)',
            dataIndex: 'price',
            key: 'price',
            width: 50,
            sorter: true

        }, {
            title: '屏蔽地市',
            dataIndex: 'shieldCity',
            key: 'shieldCity',
            width: 50
        }, {
            title: '省份',
            dataIndex: 'province',
            key: 'province',
            width: 50
        }, {
            title: '放量时间',
            dataIndex: 'volumeTime',
            key: 'volumeTime',
            width: 50
        }, {
            title: '请求间隔',
            dataIndex: 'requestInterval',
            key: 'requestInterval',
            width: 50,
          
        },
        {
            title: '日月限',
            dataIndex: 'dayMonthLimit',
            key: 'dayMonthLimit',
            width: 50
        }
            , {
            title: '流程说明',
            dataIndex: 'codeProcess',
            width: 50,
            key: 'codeProcess',
          
        }
        ];


        return (
            <div>
                 <Card >
                    <BaseForm formList={formList} filterSubmit={this.handleFilter} />
                </Card>
                <div className="content-wrap">
                    <Table
                        bordered
                        size='small'
                        columns={columns}
                        pagination={this.state.pagination}
                        dataSource={this.state.list}
                        onChange={this.handleChange}
                    />
                </div>

            </div>
        );
    }

}
