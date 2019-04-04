import React, { Component } from 'react'

import { Card, message, Form, Select, Input, Button, Table, Icon, Divider, Modal } from 'antd'
import BaseForm from '../../components/BaseForm'
import axios from '../../axios'

export default class DsManage extends Component {

    state = {
        list: [],
        isVisible: false
    }
    params = {
        page: 1,
        pageSize: 20
    }

    //接收baseForm 组件表单中的查询参数
    handleFilter = (params) => {
        this.params.businessName = params.businessName;
        this.params.dsType = params.dsType;
        this.params.dsPort = params.dsPort;
        this.requestList();
    }

    componentDidMount() {
        let  result   =   window.sessionStorage.getItem("result");
        JSON.parse(result);
        this.requestList();
       
    }

    requestList = () => {
        let _this = this;
        axios.requestList(_this, '/dsManage/getDsManageInfoList', this.params, true);
    }

    render() {
        const formList = [
            {
                type: 'INPUT',
                label: '业务名称',
                field: 'businessName',
                width: 200,
                placeholder: '请输入业务名称'
            }, {
                type: 'SELECT',
                label: '下行类型',
                field: 'dsType',
                width: 200,
                list: [{ key: '1', value: '二次确认' }, { key: '2', value: '验证码' }, { key: '3', value: '订购成功下行' }]
            }
            , {
                type: 'INPUT',
                label: '端口号',
                field: 'dsPort',
                width: 200,
                placeholder: '请输入端口号'
            }
        ]

        //设置列名
        const columns = [
        {
            title: '业务名称',
            dataIndex: 'businessName',
            width: 80
        }, {
            title: '下行类型',
            dataIndex: 'dsType',
            width: 80,
            render(dsType) {
                return {
                    '1': '二次确认',
                    '2': '验证码',
                    '3': '订购成功下行'
                }[dsType]

            }
        }, {
            title: '端口号',
            dataIndex: 'dsPort',
            width: 80
        }
            , {
            title: '内容',
            dataIndex: 'dsContent',
            width: 250

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
                    />
                </div>
              

            </div>
        );
    }

}
