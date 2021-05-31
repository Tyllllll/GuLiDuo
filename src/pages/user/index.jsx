import React, { Component } from 'react'
import { Card, Table, Button, Space, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { formateDate } from '../../utils/dateUtils'
import { reqUserList, reqAddUser, reqDeleteUser, reqUpdateUser } from '../../api'
import UserForm from './user-form'

/**
 * 用户路由
 */
export default class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      roles: [],
      isShow: false,
    }
    this.initColumns()
  }

  getUserList = async () => {
    const result = await reqUserList()
    if (result.status === 0) {
      const { users, roles } = result.data
      this.setState({ users, roles })
    }
  }

  addOrUpdateUser = async () => {
    const user = this.userForm.current.getFieldsValue()
    let result
    if (this.user._id) {
      // 修改用户
      user._id = this.user._id
      result = await reqUpdateUser(user)
    } else {
      // 添加用户
      result = await reqAddUser(user)
    }
    if (result.status === 0) {
      message.success(`${this.user._id ? '修改' : '添加'}成功`)
      this.setState({ isShow: false })
      this.getUserList()
    } else {
      message.error(result.error)
    }
  }

  deleteUser = (user) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定删除${user.username}吗`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除成功')
          this.getUserList()
        } else {
          message.error(result.error)
        }
      },
    })
  }

  showUpdate = (user) => {
    this.user = user
    this.setState({ isShow: true }, () => {
      this.userForm?.current.resetFields()
    })
  }

  showAdd = () => {
    this.user = {}
    this.setState({ isShow: true }, () => {
      this.userForm?.current.resetFields()
    })
  }

  componentDidMount() {
    this.getUserList()
  }

  render() {
    const { users, isShow, roles } = this.state
    const title = (
      <Button type='primary' onClick={this.showAdd}>
        创建用户
      </Button>
    )
    return (
      <Card title={title}>
        <Table
          dataSource={users}
          columns={this.columns}
          bordered={true}
          rowKey='_id'
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title={(this.user?._id ? '修改' : '创建') + '用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => this.setState({ isShow: false })}
        >
          <UserForm
            roles={roles}
            user={this.user}
            setForm={(form) => {
              this.userForm = form
            }}
          />
        </Modal>
      </Card>
    )
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate,
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.state.roles.find((val) => val._id === role_id).name,
      },
      {
        title: '操作',
        render: (user) => (
          <Space>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton
              onClick={() => {
                this.deleteUser(user)
              }}
            >
              删除
            </LinkButton>
          </Space>
        ),
      },
    ]
  }
}
