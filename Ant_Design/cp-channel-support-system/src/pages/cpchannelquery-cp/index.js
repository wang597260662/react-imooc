import React, { Component } from 'react'

import { Card, message, Form, Input, Button, Table, Icon, Divider, Modal, Tag } from 'antd'
import BaseForm from './../../components/BaseForm/'
import axios from '../../axios'
export default class CpChannelQuery extends Component {
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

    handleChange =  (pagination, filters, sorter) => {
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
        this.params.volumeSwitch = params.volumeSwitch;
        this.requestList();
    }



    componentWillMount(){
         this.requestSelect();
    }

    requestSelect = () => {
        let _this = this;
        axios.requestSelect(_this, '/common/getProvinceList',"","", "provinceList");
        axios.requestSelect(_this, '/common/getCityList', "", "","cityList");
    }

    componentDidMount() {
        let  result   =   window.sessionStorage.getItem("result");
        if(result){
          let merchantNo=  JSON.parse(result).merchantNo;
          this.params.merchantNo=merchantNo;
          this.requestList();
        }
    }

    requestList = () => {
        let _this = this;
        axios.requestList(_this, '/cp/getCpChanelQueryList', this.params, true);
    }

    render() {
        const formList = [
            {
                type: 'SELECT',
                label: '运营商',
                field: 'provider',
                width: 200,
                placeholder:'请选择查询的运营商',
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
                type: 'INPUT',
                label: '价格',
                field: 'price',
                width: 200,
                placeholder: '请输入查询的价格'
            }
            , {
                type: 'CASCADER',
                label: '屏蔽地市',
                field: 'shieldCity',
                width: 200,
                placeholder: '请输入查询的屏蔽地级市',
                list:this.state.cityList
            }
            , {
                type: 'SELECT',
                label: '省份',
                field: 'province',
                width: 200,
                placeholder: '请输入查询的省份',
                list:this.state.provinceList
            }
            , {
                type: 'SELECT',
                label: '放量开关',
                placeholder:'请选择放量开关',
                field: 'volumeSwitch',
                width: 200,
                list: [{ key: 1, value: '开' }, { key: 0, value: '关' }]
            }
        ]

        //设置列名
        const columns = [{
            title: '商户名称(商户号)',
            dataIndex: 'merchantName',
            width: 120,
            render: (text, record) => (
                <span>
                    {record.merchantName}{record.merchantNo}
                </span>

            )
        }, {
            title: '运营商',
            dataIndex: 'provider',
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
            width: 80
        }, {
            title: 'AppId',
            dataIndex: 'appId',
            width: 50,

        }

            , {
            title: '价格(元)',
            dataIndex: 'price',
            width: 50,
            sorter: true,
        }, {
            title: '屏蔽地市',
            dataIndex: 'shieldCity',
            width: 50
        }, {
            title: '省份',
            dataIndex: 'province',
            width: 50
        }, {
            title: '放量时间',
            dataIndex: 'volumeTime',
            width: 50
        }, {
            title: '放量开关',
            dataIndex: 'volumeSwitch',
            width: 50,
            render: tag => {
                let status = tag == '1' ? '开' : '关';
                return <span>{status}</span>;
            }
        }, {
            title: '开关更新时间',
            dataIndex: 'switchUpdateTime',
            width: 50,
            sorter: true,
        }
            , {
            title: '量级进度',
            dataIndex: 'magnitudeSchedule',
            width: 50,
            sorter: true,


        }, {
            title: '到量时间',
            dataIndex: 'timeToVolume',
            width: 50

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
