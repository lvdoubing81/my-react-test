import React from 'react'
import { Table, Button, Tag, Modal } from 'antd'
import { menuList } from '../../../../mockData/menuList'
import { useState } from 'react'
import { DeleteFilled, EditFilled, ExclamationOutlined } from '@ant-design/icons';
const {confirm} = Modal


export default function Right() {
  const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: '权限名称',
        dataIndex: 'title',
    },
    {
        title: '权限路径',
        dataIndex: 'key',
        render:(_,record)=><Tag color="gold">{record.key}</Tag>
    },
    {
        title: '操作',
        dataIndex: 'contorl',
        render: (_,item) => (
            <>
                <Button onClick={()=>showConfirm(item)} type="danger" size="small" shape="circle" style={{marginRight: '8px'}} icon={<DeleteFilled />} />
                <Button onClick={handleEdit} type="primary" size="small" shape="circle" icon={<EditFilled />} />
            </>
        )
    }
  ];
  const [dataSource,setDataSource] = useState(menuList)

  const showConfirm = (item)=>{
    confirm({
      title: '是否确认删除',
      icon: <ExclamationOutlined/>,
      onOk: () => handleDelete(item),
      onCancel: ()=>{}
    })
  }

  const handleDelete = (item)=>{
    setDataSource(getDeleted(dataSource,item))
  }
  const getDeleted = (list,item)=>{
    const arr = list.filter(dItem => dItem.id !== item.id)
    arr.map(dItem => {
      if(dItem.children?.length) {
        dItem.children = getDeleted(dItem.children, item)
      }
      return dItem
    })
    return arr
  }
  const handleEdit= () => {}
  return (
    <div>
      <Table dataSource={dataSource} 
      pagination = {{
        pageSize: 5
      }}
      scroll={{
        y: 500,
      }} columns={columns} />
    </div>
  )
}
