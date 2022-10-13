import React from 'react'
import { Menu, Dropdown, Space } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

export default function RightAvatar() {
  const menuList = [
    {
      label: '1st menu item',
      key: '1',
    },
    {
      label: '2nd menu item',
      key: '2',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
  ]
  const menu = <Menu items={menuList} />
  return (
    <Dropdown overlay={menu}>
        <Space>
            <Avatar size="large" icon={<UserOutlined />} />
        </Space>
    </Dropdown>
  )
}
