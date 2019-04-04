import React, { Component } from 'react';
import { Card, Table, Divider ,Tag} from 'antd';

export default class BasicTable extends Component {


    render() {
        const columns = [
            {
                title: 'id',
                dataIndex: 'key',
                key: 'key'
            }, {
                title: '姓名',
                dataIndex: 'name',
                key: 'name'
            }, {
                title: '年龄',
                dataIndex: 'age',
                key: 'age'
            }, {
                title: '地址',
                dataIndex: 'address',
                key: 'addrss'
            },
            {
                title: '标签',
                dataIndex: 'tags',
                render: tags => (
                    <span>
                        {
                            tags.map(tag => {
                            let color = tag.length > 5 ? 'green' : 'red';
                            if(tag==='loser'){
                                color='yellow';
                            }
                            return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>
                                
                            })

                        }

                    </span>
                )
            },


            {
                title: "操作",
                key: 'action',
                render: (record) => (
                    <span>
                        <a href='javascript:;'>  修改{record.id}{record.name}</a>
                        <Divider type="vertical" />
                        <a href="javascript:;">删除{record.id}{record.name}</a>
                    </span>
                )
            }

        ]

        const dataSource = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        }];



        return (

            <div>
                <Card title='基本表格的应用'>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                    />
                </Card>
            </div>
        );
    }

}