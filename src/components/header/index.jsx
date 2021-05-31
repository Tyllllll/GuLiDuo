import React, { Component } from 'react'
import { Modal, Space } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import './index.less'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { reqWeather } from '../../api/index'
import menuList from '../../config/menuConfig'
import { withRouter } from 'react-router'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../../components/link-button'

/**
 * 右侧头部的组件
 */
class Header extends Component {
  state = {
    currentTime: Date.now(),
    weather: '',
    title: '',
  }

  logOut = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确认退出？',
      onOk: () => {
        storageUtils.removeUser()
        memoryUtils.user = {}
        this.props.history.replace('/login')
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  getTitle = () => {
    const path = this.props.location.pathname
    const pathPrefix = path.match(/^\/[a-zA-Z0-9]{0,}/)[0]

    function getItem(array) {
      let title
      for (const val of array) {
        if (val.children) {
          title = getItem(val.children)
          if (title) return title
        } else {
          if (val.key === pathPrefix) return val.title
        }
      }
    }

    return getItem(menuList)
  }

  constructor(props) {
    super(props)
    reqWeather().then((res) => this.setState({ weather: res.lives[0].weather }))
    this.timer1s = setInterval(() => {
      const { currentTime } = this.state
      this.setState({ currentTime: currentTime + 1000 })
    }, 1000)
    this.timer30min = setInterval(() => {
      this.setState({ currentTime: Date.now() })
    }, 1000 * 60 * 30)
  }

  componentWillUnmount() {
    clearInterval(this.timer1s)
    clearInterval(this.timer30min)
  }

  render() {
    const { currentTime, weather } = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎,{username}</span>
          <LinkButton onClick={this.logOut}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <Space>
              <span>{formateDate(currentTime)}</span>
              <span>{weather}</span>
            </Space>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
