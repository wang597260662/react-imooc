import React from 'react';
import { Select, Input, Modal, message, Card, Button, Table, Form, Icon } from 'antd';
import Utils from './../../utils/utils'
import './index.less';
const FormItem = Form.Item

let id = 1;
class CpChannelBindAddForm extends React.Component {

    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        console.info(nextKeys);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }


    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 10 }
        }

        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');
        const dynamicFormItem = keys.map((k, index) => (

            <div key={k}>

                {
                    keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        />
                    ) : null
                }
                <FormItem label="codeType"  {...formItemLayout}
                >
                    {getFieldDecorator(`codeTypes[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,

                            message: "请选择一个CodeType!",
                        }],
                    })(
                        <Select showSearch  
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {Utils.getOptionListKey(this.props.codeTypeList)}
                        </Select>
                    )}


                </FormItem>
                <FormItem label="业务名称" {...formItemLayout}>
                    {

                        getFieldDecorator(`businessNames[${k}]`, {
                            validateTrigger: ['onChange', 'onBlur'],
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

                        getFieldDecorator(`codeProcesss[${k}]`, {
                            validateTrigger: ['onChange', 'onBlur'],
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


                <hr />
            </div>
        ));

        return (
            <Form layout="horizontal">

                <FormItem label="商户" {...formItemLayout}>
                    {
                        getFieldDecorator('merchantNo', {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{ required: true, message: '请选择一个商户!' }]
                        })(
                            <Select showSearch   filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {Utils.getOptionListValue(this.props.merchantList)}
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="AppId" {...formItemLayout}>
                    {

                        getFieldDecorator('appId', {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{ required: true, message: '请选择一个appId!' }]
                        })(
                            <Select showSearch  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {Utils.getOptionListKey(this.props.appIdList)}
                            </Select>
                        )
                    }
                </FormItem>

                <FormItem {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} >
                        <Icon type="plus"/> 添加绑定
                   </Button>
                </FormItem>
                <hr />
                {dynamicFormItem}
            </Form>
        );
    }
}
export default CpChannelBindAddForm = Form.create({})(CpChannelBindAddForm);