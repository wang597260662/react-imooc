import React, { Component } from 'react'
import './index.less'
import FormItem from 'antd/lib/form/FormItem';
import { Card, message, Form, Input, Button, Table, Icon, Divider, Modal } from 'antd'
import BaseForm from './../../components/BaseForm/'
import axios from '../../axios'
export default class CpManage extends Component {

    state = {
        list: [],
        isVisible: false
    }
    params = {
        page: 1,
        pageSize: 20
    }

    handleOperate = (type) => {
        let items = this.state.selectedRows;
        if (type) {
            if (type == 'edit') {
                if (!items || items.length == 0) {
                    Modal.info({
                        title: "提示",
                        content: '请选择一个商户'
                    })
                    return;
                }
                if (items.length > 1) {
                    Modal.info({
                        title: "提示",
                        content: '只能选择一个商户编辑'
                    })
                    return;
                }

                this.setState({
                    type,
                    isVisible: true,
                    title: '编辑商户',
                    merchantInfo: items[0]
                })


                //显示编辑页面
            } else if (type == 'delete') {
                if (items && items.length >= 1) {
                    //删除用户
                    let _this = this;
                    let ids = [];
                    items.map((item) => {
                        ids.push(item.id);
                    })
                    Modal.confirm({
                        title: '确认删除',
                        content: '是否要删除选中项',
                        onOk() {
                            axios.ajax_post({
                                url: '/cpMerchant/deleteCpMerchantInfos',
                                data: {
                                    params: {
                                        ids: ids
                                    }
                                }
                            }).then((res) => {
                                if (res.code == 0) {
                                    _this.setState({
                                        isVisible: false,
                                        selectedRowKeys: [],
                                        selectedRows: []
                                    })
                                    message.success("删除成功!");
                                    _this.requestList();

                                } else {
                                    message.success("删除失败!");
                                }

                            })
                        }

                    })

                } else {
                    Modal.info({
                        title: "提示",
                        content: '请选择一个商户'
                    })
                    return;
                }
            } else if (type == 'create') {
                this.setState({
                    type,
                    isVisible: true,
                    title: '创建商户',
                    merchantInfo: null
                }
                )
            }
        }


    }

    //接收baseForm 组件表单中的查询参数
    handleFilter = (params) => {
        this.params.merchantNo = params.merchantNo;
        this.params.merchantName = params.merchantName;
        this.requestList();
    }

    // 创建/编辑商户提交
    handleSubmit = () => {
        let type = this.state.type;
        this.merchantForm.props.form.validateFields((err, values) => {
            if (!err) {
                let data = this.merchantForm.props.form.getFieldsValue();
                let info = type == 'create' ? '新增' : '编辑';
                axios.ajax_post({
                    url: type == 'create' ? '/cpMerchant/addCpMerchantInfo' : '/cpMerchant/editCpMerchantInfo',
                    data: {
                        params: data
                    }
                }).then((res) => {
                    if (res.code == 0) {
                        this.merchantForm.props.form.resetFields();
                        this.setState({
                            isVisible: false,
                            selectedRowKeys: [],
                            selectedRows: []
                        })
                        message.success(info + "成功!");
                        this.requestList();

                    } else {
                        message.error(info + "失败! " + res.msg);
                    }
                })
            }
        });

    }


    componentDidMount() {
        this.requestList();
    }

    requestList = () => {
        let _this = this;
        axios.requestList(_this, '/cpMerchant/getCpMerchantInfoList', this.params, true);
    }

    render() {
        const formList = [
            {
                type: 'INPUT',
                label: '商户号',
                field: 'merchantNo',
                width: 200,
                placeholder: '请输入查询的商户号'
            }, {
                type: 'INPUT',
                label: '商户名称',
                field: 'merchantName',
                width: 200,
                placeholder: '请输入查询的商户名称'
            }
        ]

        //设置列名
        const columns = [{
            title: '商户号',
            dataIndex: 'merchantNo',
            width: 80
        }, {
            title: '商户名称',
            dataIndex: 'merchantName',
            width: 120
        }, {
            title: '密码',
            dataIndex: 'merchantPwd',
            width: 80
        }];
        const selectedRowKeys = this.state.selectedRowKeys;

        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys,
            columnWidth: 5,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            }
        }

        return (
            <div>
                <Card >
                    <BaseForm formList={formList} filterSubmit={this.handleFilter} />
                </Card>

                <Card className='operate-wrap'>
                    <Button type='primary' icon='plus' onClick={() => this.handleOperate('create')}>新增商户</Button>
                    <Button type='primary' icon='edit' onClick={() => this.handleOperate('edit')}>编辑商户</Button>
                    <Button type='primary' icon='delete' onClick={() => this.handleOperate('delete')}>删除商户</Button>
                </Card>
                <div className="content-wrap">
                    <Table
                        bordered
                        size='small'
                        columns={columns}
                        rowSelection={rowSelection}
                        pagination={this.state.pagination}
                        dataSource={this.state.list}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={() => {
                        this.merchantForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                    }}
                    width={600}

                >
                    <MerchantForm type={this.state.type} merchantInfo={this.state.merchantInfo} wrappedComponentRef={(inst) => { this.merchantForm = inst; }} />
                </Modal>

            </div>
        );
    }

}
class MerchantForm extends React.Component {



    render() {
        let type = this.props.type;
        let merchantInfo = this.props.merchantInfo || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        return (
            <Form layout="horizontal">

                <FormItem >
                    {
                        getFieldDecorator('id', {
                            initialValue: merchantInfo.id
                        })(
                            <Input hidden type="text" />
                        )
                    }
                </FormItem>
                <FormItem label="商户号" {...formItemLayout}>
                    {

                        getFieldDecorator('merchantNo', {
                            initialValue: merchantInfo.merchantNo,
                            rules: [{ required: true, message: '请输入商户号!' }, {
                                min: 5, max: 10, message: "商户号长度不符合[5-10位]!"
                            }]
                        })(
                            <Input type="text" placeholder="请输入商户号" />
                        )
                    }
                </FormItem>
                <FormItem label="商户名称" {...formItemLayout}>
                    {

                        getFieldDecorator('merchantName', {
                            initialValue: merchantInfo.merchantName,
                            rules: [{ required: true, message: '请输入商户名称!' }]
                        })(
                            <Input type="text" placeholder="请输入商户名称" />
                        )
                    }
                </FormItem>
                <FormItem label="商户密码" {...formItemLayout}>
                    {

                        getFieldDecorator('merchantPwd', {
                            initialValue: merchantInfo.merchantPwd,
                            rules: [{ required: true, message: '请输入商户密码!' }, {
                                min: 5, max: 10, message: "商户密码长度不符合[5-10位]!"
                            }]
                        })(
                            <Input type="text" placeholder="请输入商户密码" />
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
MerchantForm = Form.create({})(MerchantForm);