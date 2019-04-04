import React, { Component } from 'react'
import { Row, Col, message } from 'antd';
import './header.less';
import axios from '../../axios'
import Util from '../../utils/utils';
import { Modal, Button } from 'antd';

const confirm = Modal.confirm;
export default class Header extends Component {
    state = {userName:'小笨蛋'}
    componentWillMount() {
        let  result   = JSON.parse( window.sessionStorage.getItem("result"));
        if(result){
            this.setState({
                userName: result.merchantName
            });
        }

        setInterval(() => {
            this.setState({
                sysTime: (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
            })
        }, 1000)
      
     
    }

  



    render() {
        return (
            <div className='header'>
                <Row className='header-top'>

                    <Col span='24'>
                        <span>欢迎您 {this.state.userName}</span>
                
                    </Col>
                </Row>
                <Row className='breadcrumb'>
                    <Col span="4" className='breadcrumb-title'>
                        
                    </Col>
                    <Col span='20' className="weather">
                        <span className="date">{this.state.sysTime}</span>

                    </Col>
                </Row>
            </div>
        );
    }
}