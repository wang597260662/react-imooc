import React from 'react';
import { Select } from 'antd'
const Option = Select.Option;

export default {
 
    pagination(data,onchange,onshowsizechange){
        return {
            onChange:(current,pageSize)=>{
                onchange(current,pageSize)
            },
            onShowSizeChange:(current,pageSize)=>{
                onshowsizechange(current,pageSize)
            },
            pageSizeOptions:['20','50','100'],
            showSizeChanger:true,
            current:data.result.page,
            pageSize:data.result.pageSize,
            total: data.result.totalCount,
            showTotal:()=>{
                return `共${data.result.totalCount}条`
            },
            showQuickJumper:true
        }
    },

    getOptionListValue(itemList) { 
        if (!itemList) {
            return [];
        }
        let optionList = [];
        itemList.map((item) => {
        optionList.push(<Option value={item.key} key={item.value}>{item.value}</Option>);
        })
      
        return optionList;
    }
,
    getOptionListKey(itemList) { 
        if (!itemList) {
            return [];
        }
        let optionList = [];
        itemList.map((item) => {
        optionList.push(<Option value={item.key} key={item.value}>{item.key}</Option>);
        })
      
        return optionList;
    }
,
    getOptionList(itemList) { 
        if (!itemList) {
            return [];
        }
        let optionList = [];
        itemList.map((item) => {
        optionList.push(<Option value={item.key} key={item.value}>{item.value}</Option>);
        })
      
        return optionList;
    }

    ,
    updateSelectedItem(selectedRowKeys, selectedItem, selectedIds) {
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedItem,
                selectedIds
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem
            })
        }
    }
}