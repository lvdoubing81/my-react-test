import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const handleLogin = () => {
    localStorage.setItem('token', 123)
    navigate('/', {replace: true})
  }
  const handleLogout = () => {
    localStorage.removeItem('token')
  }
  return (
    <div>
      我是登录页面
      <Button onClick={handleLogin}>登录</Button>
      <button onClick={handleLogout}>退出</button>
    </div>
  )
}
