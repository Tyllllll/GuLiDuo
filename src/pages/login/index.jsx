import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './index.less'
import logo from '../../assets/images/logo.jpg'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

/**
 * 登录的路由组件
 */
export default class Login extends Component {
  onFinish = async (values) => {
    const { username, password } = values
    const result = await reqLogin(username, password)
    if (result.status === 0) {
      // 成功
      message.success('登录成功')
      const user = result.data
      memoryUtils.user = user
      storageUtils.saveUser(user)
      // 跳转到管理页面(不需要回退)
      this.props.history.replace('/')
    } else {
      // 失败
      message.error(result.msg)
    }
  }
  onFinishFailed = (obj) => {
    console.log('校验失败', obj)
  }

  /**
   *
   * 对密码进行验证
   */
  validatePwd = (_, value, callback) => {
    if (!value) {
      // callback会在控制台输出warming，与声明式验证效果相同，Promise.reject()不会输出warming
      // callback('密码必须输入')
      return Promise.reject(new Error('密码必须输入'))
    }
    if (value.length < 4) return Promise.reject(new Error('密码至少4位'))
    if (value.length > 12) return Promise.reject(new Error('密码至多12位'))
    if (!/^[a-zA-Z0-9_]+$/.test(value))
      return Promise.reject(new Error('密码必须由英文、数字或下划线组成'))
    return Promise.resolve()
  }

  render() {
    const user = memoryUtils.user
    if (user && user._id) {
      return <Redirect to='/' />
    }
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt='logo' />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form
            name='normal_login'
            className='login-form'
            initialValues={{
              username: 'admin',
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              name='username'
              // 声明式验证
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: '用户名必须输入',
                },
                {
                  min: 4,
                  message: '用户名至少4位',
                },
                {
                  max: 12,
                  message: '用户名至多12位',
                },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: '用户名必须由英文、数字或下划线组成',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                placeholder='Username'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  validator: this.validatePwd,
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='Password'
              />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit' className='login-form-button'>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
