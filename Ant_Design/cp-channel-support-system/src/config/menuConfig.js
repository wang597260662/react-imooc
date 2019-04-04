
const menuList = [
    {
        title: '首页',
        key: '/home'
    },{
        title:'管理员',
        key:'/admin',
        children:[ {
            title: 'CP管理',
            key: '/admin/cpmanage'
        }
        ,
        {
            title: 'CP通道绑定',
            key: '/admin/cpchannelbind'
        }
        ,
        {
            title: '通道状态查询',
            key: '/admin/cpchannelquery'
        }
        ,
        {
            title: '下行管理',
            key: '/admin/dsmanage'
        },
        {
            title: '权限设置',
            key: '/admin/permission'
        }
        ,
        {
            title: '放量省份汇总查询',
            key: '/admin/volumeprovincesum'
        }]        
    },
   

{
    title:"CP",
    key:"/cp",
    children:[
        {
            title: '通道状态查询',
            key: '/cp/cpchannelquery'
        },
        {
            title: '下行管理',
            key: '/cp/dsmanage'
        },
        {
            title: '放量省份汇总查询',
            key: '/cp/volumeprovincesum'
        }
    ]
}    
     
];
export default menuList;