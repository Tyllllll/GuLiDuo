import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'

const { Option } = Select

export default class AddForm extends Component {
  componentDidMount() {
    this.props.setForm(this.form)
  }
  form = React.createRef()
  render() {
    const { parentId, categorys } = this.props
    return (
      <Form ref={this.form} initialValues={{ select: parentId }}>
        <p>所属分类：</p>
        <Form.Item name='select'>
          <Select style={{ width: '100%' }}>
            <Option value='0' key='0'>
              一级分类列表
            </Option>
            {categorys.map((val) => (
              <Option value={val._id} key={val._id}>
                {val.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <p>分类名称：</p>
        <Form.Item name='newName' rules={[{required: true, message: '分类名称不能为空'}]}>
          <Input placeholder='请输入分类名称' />
        </Form.Item>
      </Form>
    )
  }
}
