import React, { Component } from 'react';
import { Row, Col } from 'antd';
import NavLeft from './components/NavLeft/navleft';
import Header from './components/Header/header';
import Footer from './components/Footer/footer';
import './style/common.less';
import Home from './pages/home/home';

export default class Admin extends Component {
    render() {
        return (
            <div>
                <Row className='container'>
                    <Col span={4} className='nav-left'>
                        <NavLeft />
                    </Col>
                    <Col span={20} className='main'>
                        <Header />

                        <Row className='content'>
                           {this.props.children}
                           <Footer/>
                        </Row>
                
                    </Col>
                </Row>
            </div>

        );
    }
}