import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'

import menuList from '../../config/menuConfig'

export default class AuthForm extends Component {
  state = {
    checkedKeys: [],
  }

  getMenu = () => this.state.checkedKeys

  resetSelectKeys = () => {
    this.setState({ checkedKeys: this.props.role.menus })
  }

  render() {
    const { role } = this.props
    const { checkedKeys } = this.state
    const treeData = [
      {
        title: '平台权限',
        key: 'all',
        children: menuList,
      },
    ]
    return (
      <Form>
        <Form.Item label='用户名：'>
          <Input disabled value={role.name} />
          <Tree
            checkable
            treeData={treeData}
            defaultExpandAll={true}
            defaultCheckedKeys={checkedKeys}
            checkedKeys={checkedKeys}
            onCheck={(checkedKeys) => {
              this.setState({ checkedKeys })
            }}
          />
        </Form.Item>
      </Form>
    )
  }
}
