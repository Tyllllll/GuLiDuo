import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/'
import { PAGE_SIZE } from '../../utils/constants'

const { Option } = Select

/**
 * Product默认子路由组件
 */
export default class ProductHome extends Component {
  state = {
    products: [],
    total: 0,
    loading: false,
    searchName: '',
    searchType: 'productName',
  }

  constructor(props) {
    super(props)
    this.initColumns()
  }

  render() {
    const { products, total, loading, searchName, searchType } = this.state
    const title = (
      <Space>
        <Select value={searchType} onChange={(e) => this.setState({ searchType: e })}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键词'
          value={searchName}
          onChange={(e) => this.setState({ searchName: e.target.value })}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>
          搜索
        </Button>
      </Space>
    )
    const extra = (
      <Button icon={<PlusOutlined />} type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          columns={this.columns}
          dataSource={products}
          bordered={true}
          loading={loading}
          pagination={{
            current: this.pageNum,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.getProducts,
          }}
        />
      </Card>
    )
  }

  componentDidMount() {
    this.getProducts(1)
  }

  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({ loading: true })
    const { searchName, searchType } = this.state

    let result
    if (searchName) {
      result = await reqSearchProducts(pageNum, PAGE_SIZE, searchName, searchType)
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({ loading: false })
    if (result.status === 0) {
      const { list, total } = result.data
      list.forEach((val) => (val.key = val._id))
      this.setState({ products: list, total })
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'description',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '¥' + price,
      },
      {
        title: '状态',
        key: 'status',
        render: (product) => {
          const { status, _id } = product
          return (
            <React.Fragment>
              <Button
                type='primary'
                onClick={async () => {
                  const result = await reqUpdateStatus(_id, status === 1 ? 2 : 1)
                  if (result.status === 0) {
                    message.success('更新商品成功')
                    this.getProducts(this.pageNum)
                  }
                }}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </React.Fragment>
          )
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (product) => (
          <React.Fragment>
            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>
              详情
            </LinkButton>
            <LinkButton onClick={() => { this.props.history.push('/product/addupdate', { product })}}>修改</LinkButton>
          </React.Fragment>
        ),
      },
    ]
  }
}
