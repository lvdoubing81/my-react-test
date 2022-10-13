import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom';
import { menuList } from '../../../mockData/menuList';
import './index.css'

export default function SliceMenu(props) {
  const navigate = useNavigate()
  const activeMenu = [useLocation().pathname]
  const openMenu = ['/' + useLocation().pathname?.split('/')[1]]
  const {Sider} = Layout
  const collapsed = props.collapsed
  const getMenu = (list) => {
    const arr = list.map(item => {
      const obj = {
        key: item.key,
        icon: item.icon,
        label: item.title,
      }
      if(item.children && item.children.length > 0){
        obj.children = getMenu(item.children)
      }
      return obj
    })
    return arr
  }

  const handleMenu = (menu) => {
    navigate(menu.key)
  }
  const menu = getMenu(menuList)
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo">新闻发布系统</div>
      <Menu
        onClick={handleMenu}
        theme="dark"
        mode="inline"
        className="scroll-box"
        defaultSelectedKeys={activeMenu}
        defaultOpenKeys={openMenu}
        items={menu}
        />
      </Sider>
  )
}
