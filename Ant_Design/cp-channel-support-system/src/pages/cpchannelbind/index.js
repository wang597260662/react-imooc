import React, { Component } from 'react'
import BaseForm from './../../components/BaseForm/index'
import axios from './../../../src/axios/index'
import { Select, Input,Modal,message,Card,Button,Table,Form ,Icon} from 'antd';
import CpChannelBindAddForm from './add';
import CpChannelBindEditForm from './edit';
export default class CpChannelBind extends Component {

  

    state = {
        list: [],
        isVisible: false
    }

    params = {
        page: 1,
        pageSize: 20
    }


    componentDidMount() {
        this.requestSelect();
        this.requestList();
       
    }

    requestSelect = () => {
        this.getCodeTypeList();
        this.getMerchantList();
        this.getAppIdList();
    }
    //获取codeType信息
    getCodeTypeList = () => {
        let _this = this;
        axios.requestSelect(_this, '/common/getCodeTypeList', {}, true, 'codeTypeList');
    }
    //获取商户信息
    getMerchantList = () => {
        let _this = this;
        axios.requestSelect(_this, '/common/getMerchantList', {}, true, 'merchantList');
    }
    //获取AppidList
    getAppIdList = () => {
        let _this = this;
        axios.requestSelect(_this, '/common/getAppIdList', {}, true, 'appIdList');
    }

    requestList = () => {
        let _this = this;
        axios.requestList(_this, '/cpChannelBind/getCpChannelBindInfoList', this.params, true);
    }

    handleOperate = (type) => {
        let items = this.state.selectedRows;
        if (type) {
            if (type == 'edit') {
                if (!items || items.length == 0) {
                    Modal.info({
                        title: "提示",
                        content: '请选择一个CP绑定通道信息!'
                    })
                    return;
                }
                if (items.length > 1) {
                    Modal.info({
                        title: "提示",
                        content: '只能选择一个CP绑定通道信息编辑!'
                    })
                    return;
                }
                const editForm =<CpChannelBindEditForm  type={this.state.type} 
                appIdList={this.state.appIdList}
                codeTypeList={this.state.codeTypeList} 
                merchantList={this.state.merchantList} cpChannelBind={items[0]}
                wrappedComponentRef={(inst) => { this.cpChannelBindEditForm = inst; }}/>

                this.setState({
                    type,
                    isVisible: true,
                    title: '编辑CP绑定通道信息',
                    form:editForm
                })


            } else if (type == 'delete') {
                if (items && items.length >= 1) {
                    let _this = this;
                    let ids = [];
                    items.map((item) => {
                        ids.push(item.id) ;
                    })
                    Modal.confirm({
                        title: '确认删除',
                        content: '是否要删除选中项',
                        onOk() {
                            axios.ajax_post({
                                url: '/cpChannelBind/deleteCpChannelBindInfos',
                                data: {
                                    params: {
                                        ids: ids
                                    }
                                }
                            }).then((res) => {
                                if (res.code == 0) {
                                    _this.setState({
                                        isVisible: false,
                                        selectedRowKeys:[],
                                        selectedRows:[]
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
                        content: '请选择一个CP通道绑定信息!'
                    })
                    return;
                }
            } else if (type == 'create') {
            const addForm=    <CpChannelBindAddForm type={this.state.type} 
            appIdList={this.state.appIdList}
            codeTypeList={this.state.codeTypeList} 
            merchantList={this.state.merchantList}
            wrappedComponentRef={(inst) => { this.cpChannelBindAddForm = inst; }} />

                this.setState({
                    type,
                    isVisible: true,
                    title: '创建CP通道绑定',
                    cpChannelBind: null,
                    form:addForm
                }
                )
            }
        }

    }

    //接收baseForm 组件表单中的查询参数
    handleFilter = (params) => {
        this.params.merchantNo = params.merchantNo;
        this.params.merchantName = params.merchantName;
        this.params.codeType = params.codeType;
        this.params.businessName = params.businessName;
        this.params.codeProcess = params.codeProcess;
        this.requestList();
    }

    // 创建/编辑cp绑定信息提交
    handleSubmit = () => {
        let type = this.state.type;
        const cpChannelBindForm=type== 'create'?this.cpChannelBindAddForm:this.cpChannelBindEditForm;
        cpChannelBindForm.props.form.validateFields((err, values) => {
            if (!err) {
                let data = cpChannelBindForm.props.form.getFieldsValue();
                let info = type == 'create' ? '新增' : '编辑';
                axios.ajax_post({
                    url: type == 'create' ? '/cpChannelBind/addCpChannelBindInfo' : '/cpChannelBind/editCpChannelBindInfo',
                    data: {
                        params: data
                    }
                }).then((res) => {
                    if (res.code == 0) {
                       cpChannelBindForm.props.form.resetFields();
                        this.setState({
                            isVisible: false,
                            selectedRowKeys:[],
                            selectedRows:[]
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


    render() {
        const   _this=this;
        const formList = [
            {
                type: 'INPUT',
                label: '商户号',
                field: 'merchantNo',
                width: 180,
                placeholder: '请输入查询的商户号'
            }, {
                type: 'INPUT',
                label: '商户名称',
                field: 'merchantName',
                width: 180,
                placeholder: '请输入查询的商户名称'
            }
            , {
                type: 'INPUT',
                label: 'CodeType',
                field: 'codeType',
                width: 180,
                placeholder: '请输入查询的CodeType'
                //,list:_this.state.codeTypeList
            }, {
                type: 'INPUT',
                label: '业务名称',
                field: 'businessName',
                width: 180,
                placeholder: '请输入查询的业务名称'
            }
            , {
                type: 'INPUT',
                label: '代码流程',
                field: 'codeProcess',
                width: 180,
                placeholder: '请输入查询的代码流程'
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
            title: 'AppId',
            dataIndex: 'appId',
            width: 40
        }, {
            title: 'CodeType',
            dataIndex: 'codeType',
            width: 40
        },
         {
            title: '业务名称',
            dataIndex: 'businessName',
            width: 100
        }, {
            title: '代码流程',
            dataIndex: 'codeProcess',
            width: 100
        } , {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 100
        } , {
            title: '更新时间',
            dataIndex: 'updateTime',
            width: 100
        } 

    ];
        //最前面的选择框
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
            <div> <Card >
                <BaseForm formList={formList} filterSubmit={this.handleFilter} />
            </Card>

                <Card className='operate-wrap'>
                    <Button type='primary' icon='plus' onClick={() => this.handleOperate('create')}>新增绑定</Button>
                    <Button type='primary' icon='edit' onClick={() => this.handleOperate('edit')}>编辑绑定</Button>
                    <Button type='primary' icon='delete' onClick={() => this.handleOperate('delete')}>删除绑定</Button>
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
                     if(  this.state.type== 'create'){
                        this.cpChannelBindAddForm.props.form.resetFields();
                     } 
                     if(  this.state.type== 'edit'){
                        this.cpChannelBindEditForm.props.form.resetFields();
                     } 
                 
                        this.setState({
                            isVisible: false
                        })
                    }}
                    width={1000}
                    >
            
                    {
                         this.state.form
                    }
                </Modal>
             
            </div>
        );
    }
}
