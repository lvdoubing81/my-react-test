import React, {useState} from 'react'
import { Outlet } from 'react-router-dom'
// import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import SliceMenu from '../../components/sandBox/SliceMenu'
import TopHeader from '../../components/sandBox/TopHeader'


// import Home from './home'
// import UserManage from './userManage'
// import Role from './rightManage/role'
// import Right from './rightManage/right'
// import NoPermission from './noPermission'

import './index.css'

import { Layout } from 'antd';
const { Content } = Layout;


export default function NewsSandBox() {
  const [collapsed] = useState(false);
  return (
    <Layout>
      <SliceMenu  collapsed={collapsed}/>
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
          {/* <Routes>
            <Route path='/home' element={<Home/>} />
            <Route path='/user-manage/list' element={<UserManage/>} />
            <Route path='/right-manage/role/list' element={<Role/>} />
            <Route path='/right-manage/right/list' element={<Right/>} />
            <Route path='/' exact element={<Navigate to={'/home'} />} />
            <Route path='*' element={<NoPermission/>} />
          </Routes> */}
        </Content>
      </Layout>
    </Layout>
  )
}
