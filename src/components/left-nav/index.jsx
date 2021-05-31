import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'
import * as Icon from '@ant-design/icons'
import './index.less'
import logo from '../../assets/images/logo.jpg'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'

const { SubMenu } = Menu
/**
 * 左侧导航的组件
 */
class LeftNav extends Component {
  getMenuNodes = (menuList) => {
    return menuList.map((val) => {
      if (this.hasAuth(val)) {
        if (!val.children) {
          return (
            <Menu.Item key={val.key} icon={React.createElement(Icon[val.icon])}>
              <Link to={val.key}>{val.title}</Link>
            </Menu.Item>
          )
        } else {
          if (val.children.find((cItem) => !this.props.location.pathname.indexOf(cItem.key))) {
            this.openKey = val.key
          }
          return (
            <SubMenu key={val.key} icon={React.createElement(Icon[val.icon])} title={val.title}>
              {this.getMenuNodes(val.children)}
            </SubMenu>
          )
        }
      } else {
        return null
      }
    })
  }

  hasAuth = (item) => {
    const { username, role } = memoryUtils.user
    const { menus } = role
    if (username === 'admin') {
      return true
    }
    if (menus.indexOf(item.key) !== -1) {
      return true
    }
    return item.children?.some((val) => menus.indexOf(val.key) !== -1)
  }

  constructor(props) {
    super(props)
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    const path = this.props.location.pathname
    const selectKeys = path.match(/^\/[a-zA-Z0-9]{0,}/)[0]
    return (
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt='logo' />
          <h1>神马后台</h1>
        </Link>
        <Menu
          selectedKeys={[selectKeys]}
          defaultOpenKeys={[this.openKey]}
          mode='inline'
          theme='dark'
        >
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)
