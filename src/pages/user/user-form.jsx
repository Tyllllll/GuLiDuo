import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'

export default class UserForm extends Component {
  refUserForm = React.createRef()

  componentDidMount() {
    this.props.setForm(this.refUserForm)
  }

  render() {
    const { roles, user } = this.props
    const { _id, username, phone, email, role_id } = user
    return (
      <Form
        ref={this.refUserForm}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          username,
          phone,
          email,
          role_id,
        }}
      >
        <Form.Item label='用户名：' name='username'>
          <Input placeholder='请输入用户名' />
        </Form.Item>
        {_id ? null : (
          <Form.Item label='密码：' name='password'>
            <Input placeholder='请输入密码' type='password' />
          </Form.Item>
        )}
        <Form.Item label='手机号：' name='phone'>
          <Input placeholder='请输入手机号' />
        </Form.Item>
        <Form.Item label='邮箱：' name='email'>
          <Input placeholder='请输入邮箱' />
        </Form.Item>
        <Form.Item label='角色：' name='role_id' wrapperCol={{ span: 10 }}>
          <Select placeholder='请选择角色'>
            {roles.map((val) => (
              <Select.Option value={val._id} key={val._id}>
                {val.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    )
  }
}
