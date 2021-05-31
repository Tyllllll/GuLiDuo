import React, { Component } from 'react'
import { Card, Table, Button, message, Space, Modal, Input } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddCategorys, reqUpdateCategorys } from '../../api'
import AddForm from './add-form'
import { PAGE_SIZE } from '../../utils/constants'

/**
 * 商品分类路由
 */

export default class Category extends Component {
  state = {
    categorys: [],
    subCategorys: [],
    loading: false,
    parentId: '0',
    parentName: '',
    modalShowStatus: 0,
    actionTempName: '',
  }

  showCategorys = () => {
    this.setState({ subCategorys: [], parentId: '0', parentName: '' })
  }

  showSubCategorys(category) {
    this.setState({ parentId: category._id, parentName: category.name }, () => {
      this.getCategorys()
    })
  }

  getCategorys = async (parentId) => {
    this.setState({ loading: true })
    parentId = parentId || this.state.parentId
    const result = await reqCategorys(parentId)
    this.setState({ loading: false })
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.setState({ categorys })
      } else {
        this.setState({ subCategorys: categorys })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }

  handleCancel = () => {
    this.setState({ modalShowStatus: 0 })
  }

  addCategory = async () => {
    // 1.获取返回的数据
    const { select, newName } = this.addForm.getFieldsValue()
    if (!newName) {
      message.error('分类名称不能为空')
      return
    }

    // 2.隐藏确定框
    this.handleCancel()

    // 3.发送请求更新分类
    const result = await reqAddCategorys(newName, select)
    if (result.status === 0) {
      // 4.重新显示列表
      if (select === this.state.parentId || select === '0') {
        this.getCategorys(select)
      }
    }
  }

  updateCategory = async () => {
    // 1.获取返回的数据
    const name = this.state.actionTempName
    if (!name) {
      message.error('分类名称不能为空')
      return
    }
    const { _id: parentId } = this.category

    // 2.隐藏确定框
    this.handleCancel()

    // 3.发送请求更新分类
    const result = await reqUpdateCategorys(name, parentId)
    if (result.status === 0) {
      // 4.重新显示列表
      this.getCategorys()
    }
  }

  showAdd = () => {
    this.setState({ modalShowStatus: 1 }, () => {
      // 重置表单
      this.addForm?.resetFields()
    })
  }

  showUpdate = (category) => {
    this.category = category
    this.setState({ modalShowStatus: 2, actionTempName: category.name })
  }

  componentDidMount() {
    this.getCategorys()
  }

  constructor(props) {
    super(props)
    this.initColumns()
  }

  render() {
    const {
      categorys,
      subCategorys,
      loading,
      parentId,
      parentName,
      modalShowStatus,
      actionTempName,
    } = this.state
    const title =
      parentId === '0' ? (
        '一级分类列表'
      ) : (
        <Space>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <ArrowRightOutlined />
          <span>{parentName}</span>
        </Space>
      )
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <PlusOutlined />
        添加
      </Button>
    )
    return (
      <Card title={title} extra={extra} bordered={true}>
        <Table
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          bordered={true}
          loading={loading}
          rowKey='_id'
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
        />
        <Modal
          title='添加分类'
          visible={modalShowStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => {
              this.addForm = form.current
            }}
          />
        </Modal>
        <Modal
          title='修改分类'
          visible={modalShowStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <Input
            placeholder='请输入分类名称'
            onChange={(event) => {
              this.setState({ actionTempName: event.target.value })
            }}
            value={actionTempName}
          />
        </Modal>
      </Card>
    )
  }

  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: '_id',
        width: '70%',
      },
      {
        title: '操作',
        key: 'action',
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {this.state.parentId === '0' ? (
              <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton>
            ) : null}
          </span>
        ),
      },
    ]
  }
}
