import React, { Component } from 'react'
import { Button, Card, Table, Modal, Form, Input, Select, message,Tree,Transfer } from 'antd';
import axios from './../../axios/index'
import menuConfig from './../../config/menuConfig'
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode =Tree.TreeNode

export default class Permission extends Component {
    state = {

    }

    params = {
        page: 1,
        pageSize: 20
    }


    componentDidMount() {
        this.requestList();
    }
    requestList = () => {
        axios.requestList(this, '/role/getRoleInfoList',this.params,true);
    }
    handlePermission = () => {
        let items = this.state.selectedRows;
        if (!items || items.length == 0) {
            Modal.info({
                title: "提示",
                content: '请选择一个角色设置权限'
            })
            return;
        }
        if (items.length > 1) {
            Modal.info({
                title: "提示",
                content: '只能选择一个角色设置权限'
            })
            return;
        }

        this.setState({
            isPermissionVisible: true,
            permissionInfo: items[0],
            menuInfo: items[0].menus
        })
    }

    handleRoleSubmit = () => {
        let type = this.state.roleType;
        this.roleForm.props.form.validateFields((err, values) => {
            if (!err) {
                let data = this.roleForm.props.form.getFieldsValue();
                let info = type == 'create' ? '新增' : '编辑';
                axios.ajax_post({
                    url: type == 'create' ? '/role/addRoleInfo' : '/role/editRoleInfo',
                    data: {
                        params: data
                    }
                }).then((res) => {
                    if (res.code == 0) {
                        this.roleForm.props.form.resetFields();
                        this.setState({
                            isRoleVisible: false,
                            selectedRowKeys: [],
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

// 用户授权提交
handleAuthSubmit = ()=>{
    let data = {}
    data.userIds = this.state.targetKeys;
    data.roleId = this.state.selectedRows[0].id;
    axios.ajax_post({
        url:'/merchantRole/editMerchantRoleInfo',
        data:{
            params:{
                ...data
            }
        }
    }).then((res)=>{
        if(res){
            this.setState({
                isAuthVisible:false,
                selectedRowKeys: [],
                selectedRows:[]
            })
            axios.requestList(this, '/role/getRoleInfoList', {});
        }
    })
}

    handlePermissionSubmit=()=>{
        let data = this.permissionForm.props.form.getFieldsValue();
        data.menus = this.state.menuInfo;
        axios.ajax_post({
            url:'/role/setPermission',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isPermissionVisible:false,
                    selectedRowKeys:[],
                    selectedRows:[]
                })
                message.success(  "设置成功!");
                axios.requestList(this, '/role/getRoleInfoList', {});
            }else{
                message.error("设置失败! " + res.msg);
            }
        })
    }

    handleRole = (type) => {
        let items = this.state.selectedRows;
        if (type) {
            if (type == 'edit') {
                if (!items || items.length == 0) {
                    Modal.info({
                        title: "提示",
                        content: '请选择一个角色'
                    })
                    return;
                }
                if (items.length > 1) {
                    Modal.info({
                        title: "提示",
                        content: '只能选择一个角色编辑'
                    })
                    return;
                }

                this.setState({
                    roleType: type,
                    isRoleVisible: true,
                    roleTitle: '编辑角色',
                    roleInfo: items[0]
                })

            } else if (type == 'delete') {
                if (items && items.length >= 1) {
                    //删除角色
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
                                url: '/role/deleteRoleInfos',
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
                        content: '请选择一个角色'
                    })
                    return;
                }
            } else if (type == 'create') {
                this.setState({
                    roleType: type,
                    isRoleVisible: true,
                    roleTitle: '创建角色',
                    roleInfo: null
                }
                )
            }
        }
      

    }

    handleAuth = () => {
        let items = this.state.selectedRows;
        if (!items || items.length == 0) {
            Modal.info({
                title: "提示",
                content: '请选择一个角色'
            })
            return;
        }
        if (items.length > 1) {
            Modal.info({
                title: "提示",
                content: '只能选择一个角色编辑'
            })
            return;
        }
        this.setState({
            isAuthVisible: true,
            authInfo:items[0]
        })

        this.getRoleUserList(items[0].id);
    }

    getRoleUserList = (id)=>{
        axios.ajax_post({
            url:'/role/getUserRoleList', //用户角色表,获取所有的 status=1 表示这个这个是已经分配了的用户
            data:{
                params:{
                    id
                }
            }
        }).then((res)=>{
            if(res){
                this.getAuthUserList(res.result);
            }
        })
    }

    // 筛选目标用户
    getAuthUserList = (dataSource)=>{
        const mockData = [];
        const targetKeys = [];
        if (dataSource && dataSource.length>0){
            for(let i=0;i< dataSource.length;i++){
                const data = {
                    key: dataSource[i].userId,
                    title: dataSource[i].userName,
                    status: dataSource[i].status
                }
                if(data.status == 1){
                    targetKeys.push(data.key);
                }
                mockData.push(data);
            }
            this.setState({
                mockData, targetKeys
            })
        }
    }




    render() {
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
        const columns = [
            {
                title: '角色ID',
                dataIndex: 'id'
            }, {
                title: '角色名称',
                dataIndex: 'roleName'
            }, {
                title: '状态',
                dataIndex: 'status',
                render(status) {
                    return status == 1 ? '启用' : '停用'
                }
            }, {
                title: '创建时间',
                dataIndex: 'createTime'
            }, {
                title: '更新时间',
                dataIndex: 'updateTime'
            },

        ]

        return (
            <div>
                <Card className='operate-wrap'>
                    <Button type='primary' icon='plus' onClick={() => this.handleRole('create')} >创建角色</Button>
                    <Button type='primary' icon='edit' onClick={() => this.handleRole('edit')} >编辑角色</Button>
                    <Button type='primary' icon='delete' onClick={() => this.handleRole('delete')} >删除角色</Button>
                    <Button type='primary' icon='plus' onClick={this.handlePermission} >设置权限</Button>
                    <Button type='primary' icon='plus' onClick={this.handleAuth}  >用户授权</Button>

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
                    title={this.state.roleTitle}
                    visible={this.state.isRoleVisible}
                    onOk={this.handleRoleSubmit}
                    onCancel={() => {
                        this.roleForm.props.form.resetFields();
                        this.setState({
                            isRoleVisible: false
                        })
                    }}
                    width={600} >
                    <RoleForm roleInfo={this.state.roleInfo} wrappedComponentRef={(inst) => { this.roleForm = inst; }} />
                </Modal>

                <Modal
                    title='设置权限'
                    visible={this.state.isPermissionVisible}
                    onOk={this.handlePermissionSubmit}
                    onCancel={() => {
                        this.permissionForm.props.form.resetFields();
                        this.setState({
                            isPermissionVisible: false
                        })
                    }}
                    width={600} >
                    <PermissionForm permissionInfo={this.state.permissionInfo} menuInfo={this.state.menuInfo}  patchMenuInfo={(checkedKeys)=>{
                            this.setState({
                                menuInfo: checkedKeys
                            })
                        }} wrappedComponentRef={(inst) => { this.permissionForm = inst; }} />
                </Modal>


                <Modal
                    title='用户授权'
                    visible={this.state.isAuthVisible}
                    onOk={this.handleAuthSubmit}
                    onCancel={() => {
                        this.authForm.props.form.resetFields();
                        this.setState({
                            isAuthVisible: false
                        })
                    }}
                    width={800} >
                    <AuthForm 
                     authInfo={this.state.authInfo}
                     targetKeys={this.state.targetKeys}
                     mockData={this.state.mockData}
                     patchUserInfo={(targetKeys)=>{
                         this.setState({
                             targetKeys
                         })
                     }}
                    
                    wrappedComponentRef={(inst) => { this.authForm = inst; }} />
                </Modal>

            </div>

        );
    }
}

class RoleForm extends Component {



    render() {

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        const roleInfo = this.props.roleInfo || {};
        return (
            <Form layout="horizontal">
                <FormItem >
                    {
                        getFieldDecorator('id', {
                            initialValue: roleInfo.id
                        })(
                            <Input hidden type="text" ></Input>
                        )
                    }
                </FormItem>
                <FormItem label="角色名称" {...formItemLayout}>
                    {

                        getFieldDecorator('roleName', {
                            initialValue: roleInfo.roleName,
                            rules: [{ required: true, message: '请输入一个角色名称!' },]
                        })(
                            <Input type="text" placeholder='请输入一个角色名称'></Input>
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {

                        getFieldDecorator('status', {
                            initialValue: roleInfo.status,
                            rules: [{ required: true, message: '请选择一个状态!' }]
                        })(
                            <Select placeholder="请选择一个状态">
                                <Option value='1'>启用</Option>
                                <Option value='0'>停用</Option>
                            </Select>
                        )

                      
                    }
                </FormItem>
            </Form>
        );
    }


}

RoleForm = Form.create({})(RoleForm);


class PermissionForm extends Component {

    renderTreeNodes = (data)=>{
        return data.map((item)=>{
            if(item.children){
                return <TreeNode title={item.title} key={item.key}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            }else{
                return <TreeNode {...item}/>
            }
        })
    }

    onCheck = (checkedKeys)=>{
        this.props.patchMenuInfo(checkedKeys)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        const permissionInfo = this.props.permissionInfo;
        const menuInfo = this.props.menuInfo;
        return (
            <Form layout="horizontal">

                <FormItem >
                    {
                        getFieldDecorator('id', {
                            initialValue: permissionInfo.id
                        })(
                            <Input hidden type="text" ></Input>
                        )
                    }
                </FormItem>
            <FormItem label="角色名称" {...formItemLayout}>
                <Input disabled placeholder={permissionInfo.roleName}/>
            </FormItem>
           
            <Tree
                checkable={true}
                defaultExpandAll
                onCheck={(checkedKeys)=>{
                    this.onCheck(checkedKeys)
                }}
                checkedKeys={menuInfo}
            >
                <TreeNode title="平台权限" key="platform_all">
                    {this.renderTreeNodes(menuConfig)}
                </TreeNode>
            </Tree>
        </Form>
        );
    }
}

PermissionForm = Form.create({})(PermissionForm);



class AuthForm extends Component {
    onCheck = (checkedKeys) => {
        this.props.patchMenuInfo(checkedKeys)
    }
    filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1;
    }
    handleChange = (targetKeys)=>{
        this.props.patchUserInfo(targetKeys);
    }

    render() {
            const { getFieldDecorator } = this.props.form;
            const formItemLayout = {
                labelCol: { span: 5 },
                wrapperCol: { span: 19 }
            }
            const authInfo = this.props.authInfo;
            const menuInfo = this.props.menuInfo;
            return (
                <Form layout="horizontal">
                    <FormItem label="角色名称" {...formItemLayout}>
                        <Input disabled placeholder={authInfo.roleName} />
                    </FormItem>
                    <FormItem label="选择用户" {...formItemLayout}>
                        <Transfer
                            listStyle={{width:200,height:400}}
                            dataSource={this.props.mockData}
                            titles={['待选用户', '已选用户']}
                            showSearch
                            searchPlaceholder='输入用户名'
                            filterOption={this.filterOption}
                            targetKeys={this.props.targetKeys}
                            onChange={this.handleChange}
                            render={item => item.title}
                        />
                    </FormItem>
                </Form>
        );
    }
}

AuthForm = Form.create({})(AuthForm);