import React, { Component } from 'react'

import { Input,Select, Button, Form, InputNumber,Cascader,Checkbox, Radio } from 'antd';
import Utils from './../../utils/utils';
const FormItem = Form.Item;
const Option = Select.Option;
class FilterForm extends Component {
    handleFilterSubmit=()=>{
        let fieldsValue=this.props.form.getFieldsValue();
        this.props.filterSubmit(fieldsValue);
    }

    reset=()=>{
        this.props.form.resetFields();
    }

    initFormList = () => {
        const { getFieldDecorator } = this.props.form;
        const formList = this.props.formList;
        const formItemList = [];
        if (formList && formList.length>0) {
            formList.map((item) => {
                let type = item.type;
                let lable = item.label;
                let initiaValue = item.initiaValue || '';
                let placeholder = item.placeholder;
                let width = item.width;
                let field = item.field;

                if (type == 'INPUT') {
                    const INPUT = <FormItem label={lable} key={field}>
                        {getFieldDecorator([field], {
                            initiaValue: initiaValue
                        })(
                            <Input  style={{ width: width }} placeholder={placeholder} />
                        )}
                    </FormItem>
                    formItemList.push(INPUT);
                } else if (type == 'SELECT') {
                    const SELECT = <FormItem  label={lable} key={field}>
                        {
                            getFieldDecorator([field], {
                                initiaValue: initiaValue
                            })(
                                <Select showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                style={{ width: width }}
                                placeholder={placeholder}>
                                {Utils.getOptionList(item.list)}
                            </Select>
                            )
                        }

                    </FormItem>
                    formItemList.push(SELECT);
                } else if (type == 'INPUTNUMBER') {
                    const INPUTNUMBER = <FormItem  label={lable} key={field}>
                        {
                            getFieldDecorator([field], {
                                initiaValue: initiaValue
                            })(
                                <InputNumber style={{ width: width }} placeholder={placeholder}  ></InputNumber>
                            )
                        }

                    </FormItem>
                    formItemList.push(INPUTNUMBER);
                }  
                
                else if (type == 'CASCADER') {
                    const CASCADER = <FormItem  label={lable} key={field}>
                        {
                            getFieldDecorator([field], {
                                initiaValue: initiaValue
                            })(

                                <Cascader
                                style={{ width: width }}
                                options={item.list}
                                placeholder={placeholder}
                                showSearch={ (inputValue, path)=>(path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))}
                              />
                            )
                        }

                    </FormItem>
                    formItemList.push(CASCADER);
                }

            })
        }
        return formItemList;
    }

    render() {
        return (<Form layout='inline'>
            {this.initFormList()}
            <Button type='primary' style={{marginTop:5}} onClick={this.handleFilterSubmit} >查询</Button>
            <Button  style={{marginLeft:20 }} onClick={this.reset} >重置</Button>
        </Form>);
    }

}
export default Form.create({})(FilterForm);