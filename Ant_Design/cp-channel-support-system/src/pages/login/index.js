import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import './index.less'
import axios from 'axios'



class NormalLoginForm extends Component {
    handleSubmit = (e) => {
        this.props.form.validateFields((err, values) => {

            if (!err) {
                let data = this.props.form.getFieldsValue();

                axios({
                    url: '/cpLogin',
                    method: 'get',
                    timeout: 5000,
                    params: data
                }).then((response) => {
                        if (response.status == '200') {
                            let res = response.data;
                            if (res.code == '0') {
                                if (res.result) {
                                   window.sessionStorage.setItem("result", JSON.stringify(res.result));
                                   message.success("登录成功");
                                   this.props.history.push('/home')
                                }
                            } else {
                                message.error("登录失败：" + res.msg);
                            }
                        } else {
                           message.error("登录失败");
                       }
                     })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='login-div' >
                <div className='login-title'>
                    <img src='https://t.alipayobjects.com/images/T1QUBfXo4fXXXXXXXX.png' />
                    <span>CP通道查询系统</span>
                </div>

                <Form className="login-form">
                    <Form.Item>
                        {getFieldDecorator('userName', {
                            rules: [
                                { required: true, message: '请输入用户名!' },
                                { pattern: new RegExp('^\\w+$', 'g'), message: '用户名必须为字母或者数字' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [
                                { required: true, message: '请输入密码!' },
                                { min: 5, max: 10, message: '密码长度有误!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </Form.Item>
                    <Form.Item>

                        <Button type="primary" onClick={this.handleSubmit} className="login-form-button">
                            登录
                        </Button>

                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default Form.create()(NormalLoginForm);


