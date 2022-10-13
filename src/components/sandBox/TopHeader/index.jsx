import React, {useState} from 'react'
import { Layout } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import RightAvatar from './avatar';

export default function TopHeader() {
  const {Header} = Layout
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: "0 20px",
      }}
    >
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })}
      <div style={{float: 'right'}}>
        <span style={{marginRight: '12px'}}>欢迎admin回来</span>
        <RightAvatar />
      </div>
    </Header>
  )
}
