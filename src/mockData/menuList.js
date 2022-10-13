import {
    UserOutlined,
  } from '@ant-design/icons';
export const menuList = [
    {
      id: '1',
      key: '/home',
      title: '首页',
      icon: <UserOutlined />
    },
    {
      id: '2',
      key: '/user-manage',
      title: '用户管理',
      icon: <UserOutlined />,
      children: [
        {
          id:'3',
          key: '/user-manage/list',
          title: '用户列表',
          // icon: <UserOutlined />
        },
      ]
    },
    {
      id: '4',
      key: '/right-manage',
      title: '权限管理',
      icon: <UserOutlined />,
      children: [
        {
          id: '5',
          key: '/right-manage/role/list',
          title: '角色列表',
          // icon: <UserOutlined />
        },
        {
          id: '6',
          key: '/right-manage/right/list',
          title: '权限列表',
          // icon: <UserOutlined />
        },
      ]
    },
    {
      id: '7',
      key: '/news-manage',
      title: '新闻管理',
      icon: <UserOutlined />,
      children: [
        {
          id: '8',
          key: '/news-manage/write',
          title: '撰写新闻',
          // icon: <UserOutlined />
        },
        {
          id: '9',
          key: '/news-manage/drafts',
          title: '草稿箱',
          // icon: <UserOutlined />
        },
        {
          id: '10',
          key: '/news-manage/classification',
          title: '新闻分类',
          // icon: <UserOutlined />
        },
      ]
    },
    {
      id: '11',
      key: '/audit',
      title: '审核管理',
      icon: <UserOutlined />,
      children: [
        {
          id: '12',
          key: '/audit/news',
          title: '角色列表',
          // icon: <UserOutlined />
        },
        {
          id: '13',
          key: '/audit/list',
          title: '权限列表',
          // icon: <UserOutlined />
        },
      ]
    },
    {
      id: '14',
      key: '/release',
      title: '发布管理',
      icon: <UserOutlined />,
      children: [
        {
          id: '15',
          key: '/release/published',
          title: '已发布',
          // icon: <UserOutlined />
        },
        {
          id: '16',
          key: '/audit/wait',
          title: '待发布',
          // icon: <UserOutlined />
        },
        {
          id: '17',
          key: '/audit/offline',
          title: '已下线',
        }
      ]
    },
    
  ]