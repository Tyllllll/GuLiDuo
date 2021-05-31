import React, { Component } from 'react'
import { Card, List, Space } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { baseURL, reqCategoryName } from '../../api'

/**
 * Product详情的子路由组件
 */
export default class ProductDetail extends Component {
  state = {
    categoryName: '',
    pCategoryName: '',
  }

  render() {
    const { name, desc, price, imgs, detail } = this.props.location.state.product
    const { categoryName, pCategoryName } = this.state
    const content = [
      { key: '商品名称', value: name },
      { key: '商品描述', value: desc },
      { key: '商品价格', value: price + '元' },
      { key: '所属分类', value: (pCategoryName ? pCategoryName + '-->' : '') + categoryName },
      {
        key: '商品图片',
        value: imgs.map((val) => `<img style='height: 150px;' src='${baseURL}/upload/${val}' />`).join('')
      },
      { key: '商品详情', value: detail },
    ]
    const title = (
      <Space>
        <LinkButton>
          <ArrowLeftOutlined onClick={() => this.props.history.goBack()} />
        </LinkButton>
        <span>商品详情</span>
      </Space>
    )
    return (
      <Card title={title}>
        <List bordered={true}>
          {content.map((val, index) => (
            <List.Item key={index}>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{val.key}：</span>
                <span dangerouslySetInnerHTML={{ __html: val.value }} />
              </div>
            </List.Item>
          ))}
        </List>
      </Card>
    )
  }

  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state.product
    if (pCategoryId === '0') {
      const result = await reqCategoryName(categoryId)
      if (result.status === 0) {
        const name = result.data.name
        this.setState({ categoryName: name })
      }
    } else {
      const [result, presult] = await Promise.all([
        reqCategoryName(categoryId),
        reqCategoryName(pCategoryId),
      ])
      if (result.status === 0 && presult.status === 0) {
        const name = result.data.name
        const pname = presult.data.name
        this.setState({ categoryName: name, pCategoryName: pname })
      }
    }
  }
}
