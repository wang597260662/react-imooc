import React from 'react';
import { Select, Input, Modal, message, Card, Button, Table, Form, Icon } from 'antd';
import Utils from './../../utils/utils'
import './index.less';
const FormItem = Form.Item


class CpChannelBindEditForm extends React.Component {

    render() {
        let cpChannelBind = this.props.cpChannelBind || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 10 }
        }
        return (
            <Form layout="horizontal">

                <FormItem >
                    {
                        getFieldDecorator('id', {
                            initialValue: cpChannelBind.id
                        })(
                            <Input hidden type="text" />
                        )
                    }
                </FormItem>
                <FormItem label="商户" {...formItemLayout}>
                    {
                        getFieldDecorator('merchantNo', {
                            initialValue: cpChannelBind.merchantNo,
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{ required: true, message: '请选择一个商户!' }]
                        })(
                            <Select 
                            showSearch 
                             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {Utils.getOptionList(this.props.merchantList)}
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="AppId" {...formItemLayout}>
                    {

                        getFieldDecorator('appId', {
                            initialValue: cpChannelBind.appId,
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{ required: true, message: '请选择一个appId!' }]
                        })(
                            <Select
                             showSearch 
                             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {Utils.getOptionListKey(this.props.appIdList)}
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="codeType"  {...formItemLayout}
                >
                    {getFieldDecorator('codeType', {
                        initialValue: cpChannelBind.codeType,
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message: "请选择一个CodeType!",
                        }],
                    })(
                        <Select showSearch  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                            {Utils.getOptionListKey(this.props.codeTypeList)}
                        </Select>
                    )}


                </FormItem>
                <FormItem label="业务名称" {...formItemLayout}>
                    {

                        getFieldDecorator('businessName', {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue: cpChannelBind.businessName,
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: '请输入业务名称!'
                            }]
                        })(
                            <Input type='text' placeholder='请输入业务名称'></Input>
                        )
                    }
                </FormItem>

                <FormItem label="代码流程"  {...formItemLayout}>
                    {

                        getFieldDecorator('codeProcess', {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue: cpChannelBind.codeProcess,
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: '请选择一个代码流程!'
                            }]
                        })(
                            <Input type='text' placeholder='请输入代码流程'></Input>
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(CpChannelBindEditForm);