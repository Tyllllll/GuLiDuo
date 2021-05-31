import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Layout } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home'
import Category from '../category'
import Product from '../product'
import Role from '../role'
import User from '../user'
import Bar from '../chats/bar'
import Line from '../chats/line'
import Pie from '../chats/pie'

const { Footer, Sider, Content } = Layout

/**
 * 后台管理的路由组件
 */
export default class Login extends Component {
  render() {
    const { user } = memoryUtils
    if (!user || !user._id) {
      return <Redirect to='/login' />
    }
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content style={{ backgroundColor: 'white' , margin: '20px'}}>
            <Switch>
              <Route path='/home' component={Home}></Route>
              <Route path='/category' component={Category}></Route>
              <Route path='/product' component={Product}></Route>
              <Route path='/role' component={Role}></Route>
              <Route path='/user' component={User}></Route>
              <Route path='/charts/bar' component={Bar}></Route>
              <Route path='/charts/line' component={Line}></Route>
              <Route path='/charts/pie' component={Pie}></Route>
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#bbb' }}>
            推荐使用IE3浏览器。IE浏览器，用了都说好
          </Footer>
        </Layout>
      </Layout>
    )
  }
}
