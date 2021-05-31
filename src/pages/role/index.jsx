import React, { Component } from 'react'
import { Button, Card, Space, Table, Modal, Input, Row, Col, message } from 'antd'

import { PAGE_SIZE } from '../../utils/constants'
import { reqRoleList, reqAddRole, reqUpdateRole } from '../../api'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import { formateDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'

/**
 * 角色路由
 */
export default class Role extends Component {
  state = {
    roles: [],
    role: {},
    isShowAdd: false,
    actionTempName: '',
    isShowAuth: false,
  }

  constructor(props) {
    super(props)
    this.initColumns()
    this.refAuthForm = React.createRef()
  }

  componentDidMount() {
    this.getRoleList()
  }

  render() {
    const { roles, role, isShowAdd, actionTempName, isShowAuth } = this.state
    const title = (
      <Space>
        <Button
          type='primary'
          onClick={() => {
            this.setState({ isShowAdd: true })
          }}
        >
          创建角色
        </Button>
        <Button
          type='primary'
          disabled={!role._id}
          onClick={() => {
            this.setState({ isShowAuth: true }, () => {
              this.refAuthForm.current.resetSelectKeys()
            })
          }}
        >
          设置角色权限
        </Button>
      </Space>
    )
    return (
      <Card title={title}>
        <Table
          dataSource={roles}
          columns={this.columns}
          bordered={true}
          rowKey='_id'
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onChange: (_id, roles) => {
              this.setState({ role: roles[0] })
            },
          }}
          onRow={this.onRow}
        />
        <Modal
          title='创建角色'
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false })
          }}
        >
          <Row>
            <Col span={4}>
              <span style={{ lineHeight: '32px' }}>角色名称：</span>
            </Col>
            <Col span={20}>
              <Input
                placeholder='请输入角色名称'
                onChange={(event) => {
                  this.setState({ actionTempName: event.target.value })
                }}
                value={actionTempName}
              />
            </Col>
          </Row>
        </Modal>

        <Modal
          title='设置角色权限'
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
          <AuthForm role={role} ref={this.refAuthForm} />
        </Modal>
      </Card>
    )
  }

  updateRole = async () => {
    const menus = this.refAuthForm.current.getMenu()
    const { role } = this.state
    const result = await reqUpdateRole(role._id, memoryUtils.user.username, menus)
    if (result.status === 0) {
      // 修改当前用户的角色，重新登陆
      if (role.name === memoryUtils.user.role.name) {
        message.info('角色权限更改，请重新登陆')
        storageUtils.removeUser()
        memoryUtils.user = {}
        this.props.history.replace('/login')
      } else {
        message.success('角色更新成功')
        this.setState({ isShowAuth: false, role: { ...role, menus } })
        this.getRoleList()
      }
    } else {
      message.error(result.error)
    }
  }

  addRole = async () => {
    const { actionTempName, roles } = this.state
    // 表单验证
    if (/^\W{2,8}$/.test(actionTempName)) {
      const result = await reqAddRole(actionTempName)
      if (result.status === 0) {
        message.success('添加成功')
        const newRoles = [...roles, result.data]
        this.setState({ isShowAdd: false, actionTempName: '', roles: newRoles })
      } else {
        message.error(result.error)
      }
    } else {
      message.error('角色名为2-8位')
    }
  }

  getRoleList = async () => {
    const result = await reqRoleList()
    if (result.status === 0) {
      this.setState({ roles: result.data })
    } else {
      message.error(result.error)
    }
  }

  onRow = (role) => {
    return {
      onClick: () => {
        this.setState({ role })
      },
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate,
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate,
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }
}
