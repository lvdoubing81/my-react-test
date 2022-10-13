import React from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/login'
import NewsSandBox from '../pages/newsSandBox'

import Home from '../pages/newsSandBox/home'
import UserManage from '../pages/newsSandBox/userManage'
import Role from '../pages/newsSandBox/rightManage/role'
import Right from '../pages/newsSandBox/rightManage/right'
import NoPermission from '../pages/newsSandBox/noPermission'

export default function Router() {
  const isLogin = localStorage.getItem('token') ? <NewsSandBox /> : <Navigate to={'/login'} />
  return (
    <HashRouter>
        <Routes>
            <Route path='/login' element={<Login/>} />
            <Route path='/' element={isLogin}>
                <Route path='/home' element={<Home/>} />
                <Route path='/user-manage/list' element={<UserManage/>} />
                <Route path='/right-manage/role/list' element={<Role/>} />
                <Route path='/right-manage/right/list' element={<Right/>} />
                <Route path='/' exact element={<Home/>} />
                <Route path='*' element={<NoPermission/>} />
            </Route>
        </Routes>
    </HashRouter>
  )
}
