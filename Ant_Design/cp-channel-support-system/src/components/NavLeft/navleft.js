import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import './navleft.less'
import { Link } from 'react-router-dom';
import MenuConfig from './../../config/menuConfig'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


export default class NavLeft extends Component {

    
    componentWillMount() {

        let  result   =   window.sessionStorage.getItem("result");
        let menuTreeNode;
        if(!result){
            menuTreeNode=this.renderMenu(MenuConfig);
        }else{
            console.info(result);
           let menuConfig= JSON.parse(result).menuConfig;
           if(menuConfig){
            menuTreeNode = this.renderMenu(menuConfig);
           }
    
        }
    
        this.setState({
            menuTreeNode
        })

    }
    //菜单渲染
     renderMenu =(data)=>{
        return data.map((item)=>{
            if(item.children){
                return (
                    <SubMenu title={item.title} key={item.key}>
                        { this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return <Menu.Item title={item.title} key={item.key}>
                   <Link to={item.key}>{item.title}</Link> 
            </Menu.Item>
        })
    }



    render() {
        return (
            <div className='logo'>
                <img src="/assets/logo-ant.svg" alt="" />
                <h1>CP 通道查询系统</h1>
                <Menu theme='dark'    mode="inline" >
                   { this.state.menuTreeNode }
                </Menu>
            </div>

        );
    }
}