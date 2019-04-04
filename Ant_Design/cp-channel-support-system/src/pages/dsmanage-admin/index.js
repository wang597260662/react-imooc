import React, { Component } from 'react'
import './index.less'
import FormItem from 'antd/lib/form/FormItem';
import { Card, message, Form, Select, Input, Button, Table, Icon, Divider, Modal } from 'antd'
import BaseForm from '../../components/BaseForm'
import axios from '../../axios'
import TextArea from 'antd/lib/input/TextArea';
import Utils from '../../utils/utils'
const Option = Select.Option;
export default class DsManage extends Component {

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
                        content: '请选择一个下行'
                    })
                    return;
                }
                if (items.length > 1) {
                    Modal.info({
                        title: "提示",
                        content: '只能选择一个下行编辑'
                    })
                    return;
                }

                this.setState({
                    type,
                    isVisible: true,
                    title: '编辑下行',
                    dsInfo: items[0]
                })

            } else if (type == 'delete') {
                if (items && items.length >= 1) {
                    //删除下行
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
                                url: '/dsManage/deleteDsManageInfos',
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
                    title: '创建下行',
                    dsInfo: null
                }
                )
            }
        }

    }

    //接收baseForm 组件表单中的查询参数
    handleFilter = (params) => {
        this.params.businessName = params.businessName;
        this.params.dsType = params.dsType;
        this.params.dsPort = params.dsPort;
        this.params.codeType = params.codeType;
        this.requestList();
    }

    // 创建/编辑商户提交
    handleSubmit = () => {
        let type = this.state.type;
        this.dsForm.props.form.validateFields((err, values) => {
            if (!err) {
                let data = this.dsForm.props.form.getFieldsValue();
                let info = type == 'create' ? '新增' : '编辑';
                axios.ajax_post({
                    url: type == 'create' ? '/dsManage/addDsManageInfo' : '/dsManage/editDsManageInfo',
                    data: {
                        params: data
                    }
                }).then((res) => {
                    if (res.code == 0) {
                        this.dsForm.props.form.resetFields();
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

    //获取codeType
    getCodeType = () => {
        let _this = this;
        axios.requestSelect(_this, '/common/getCodeTypeList', {}, true, 'codeTypeList');
    }


    componentDidMount() {
        this.requestList();
        this.getCodeType();
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

        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 100
        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            width: 100
        }

        ];
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
                    <Button type='primary' icon='plus' onClick={() => this.handleOperate('create')}>创建下行</Button>
                    <Button type='primary' icon='edit' onClick={() => this.handleOperate('edit')}>编辑下行</Button>
                    <Button type='primary' icon='delete' onClick={() => this.handleOperate('delete')}>删除下行</Button>
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
                        this.dsForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                    }}
                    width={600}
                >
                    <DSForm type={this.state.type} dsInfo={this.state.dsInfo} codeTypeList={this.state.codeTypeList} wrappedComponentRef={(inst) => { this.dsForm = inst; }} />
                </Modal>

            </div>
        );
    }

}
class DSForm extends React.Component {

    render() {
        let codeTypeList = this.props.codeTypeList;

        let type = this.props.type;
        let dsInfo = this.props.dsInfo || {};

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
                            initialValue: dsInfo.id
                        })(
                            <Input hidden type="text" />
                        )
                    }
                </FormItem>
                <FormItem label="业务名称" {...formItemLayout}>
                    {
                        getFieldDecorator('businessName', {
                            initialValue: dsInfo.businessName,
                            rules: [{ required: true, message: '请输入一个业务名称' },]
                        })(
                            <Input type="text" placeholder="请输入端口号" />

                        )
                    }
                </FormItem>
                <FormItem label="下行类型" {...formItemLayout}>
                    {

                        getFieldDecorator('dsType', {
                            initialValue: dsInfo.dsType,
                            rules: [{ required: true, message: '请选择一个下行类型!' }]
                        })(
                            <Select placeholder="请选择一个下行类型">
                                <Option value={1}>二次回复</Option>
                                <Option value={2}>验证码</Option>
                                <Option value={3}>成功订购下行</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="端口号" {...formItemLayout}>
                    {
                       
                            getFieldDecorator('dsPort', {
                                initialValue: dsInfo.dsPort,
                                rules: [{ required: true, message: '请输入端口号!' },]
                            })(
                                <Input type="text" placeholder="请输入端口号" />
                            )
                    }
                </FormItem>
                <FormItem label="下行内容" {...formItemLayout}>
                    {
                        type == 'detail' ? dsInfo.dsContent :
                            getFieldDecorator('dsContent', {
                                initialValue: dsInfo.dsContent,
                                rules: [{ required: true, message: '请输入内容!' },]
                            })(
                                <TextArea autosize={true} placeholder="请输入内容" />
                            )
                    }
                </FormItem>
            </Form>
        );
    }
}
DSForm = Form.create({})(DSForm);