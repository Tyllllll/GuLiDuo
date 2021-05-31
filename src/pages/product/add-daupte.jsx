import React, { Component } from 'react'
import { Card, Space, Form, Input, Cascader, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddProduct, reqUpdateProduct } from '../../api'
import PictureWall from './picture-wall'
import RichTextEditor from './rich-text-editor'

const { Item } = Form

/**
 * Product添加和更新的子路由组件
 */
export default class ProductAddUpdate extends Component {
  state = {
    optionLists: [],
    product: {},
  }

  constructor(props) {
    super(props)
    const product = this.props.location.state?.product
    this.state.product = product || {}
    this.isUpdate = !!product
    this.refPicWall = React.createRef()
    this.refRichTextEditor = React.createRef()
  }

  render() {
    const { isUpdate } = this
    const { optionLists, product } = this.state
    const { name, desc, price, pCategoryId, categoryId, detail } = product
    // 防止product为空，导致imgs不是数组
    const imgs = product?.imgs || []
    const categoryInitial = []
    if (isUpdate) {
      if (pCategoryId !== '0') {
        categoryInitial.push(pCategoryId)
      }
      categoryInitial.push(categoryId)
    }
    const formLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    }
    const title = (
      <Space>
        <LinkButton
          onClick={() => {
            this.props.history.goBack()
          }}
        >
          <ArrowLeftOutlined />
        </LinkButton>
        <span>{isUpdate ? '修改' : '添加'}商品</span>
      </Space>
    )
    return (
      <Card title={title}>
        <Form
          {...formLayout}
          name='basic'
          initialValues={{
            name: name,
            desc: desc,
            price: price,
            category: categoryInitial,
          }}
          onFinish={this.onFinish}
          onFinishFailed={() => {
            message.error('提交失败')
          }}
        >
          <Item
            label='商品名称'
            name='name'
            rules={[
              {
                required: true,
                message: '请输入商品名称!',
              },
            ]}
          >
            <Input />
          </Item>

          <Item
            label='商品描述'
            name='desc'
            rules={[
              {
                required: true,
                message: '请输入商品描述!',
              },
            ]}
          >
            <Input.TextArea placeholder='请输入商品描述' autoSize={{ minRows: 1 }} />
          </Item>

          <Item
            label='商品价格'
            name='price'
            rules={[
              {
                required: true,
                message: '请输入商品价格!',
              },
              {
                validator: (_, value) =>
                  value * 1 > 0 ? Promise.resolve() : Promise.reject(new Error('价格必须大于0')),
              },
            ]}
          >
            <Input type='number' addonAfter='元' />
          </Item>

          <Item
            label='商品分类'
            name='category'
            rules={[
              {
                required: true,
                message: '请选择商品分类!',
              },
            ]}
          >
            <Cascader
              options={optionLists}
              changeOnSelect={true}
              loadData={this.cascaderLoadData}
            />
          </Item>

          <Item label='商品图片' name='imgs'>
            <PictureWall ref={this.refPicWall} imgs={imgs} />
          </Item>

          <Item label='商品详情' name='detail' wrapperCol={{ span: 14 }}>
            <RichTextEditor ref={this.refRichTextEditor} detail={detail} />
          </Item>

          <Item wrapperCol={{ offset: 1 }}>
            <Button type='primary' htmlType='submit'>
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    )
  }

  componentDidMount() {
    this.getCategorys('0')
  }

  // 表单验证成功的回调
  onFinish = async (value) => {
    value.imgs = this.refPicWall.current.getImgs()
    // 修改分类
    const { category } = value
    if (category.length === 2) {
      value.pCategoryId = category[0]
      value.categoryId = category[1]
    } else {
      value.pCategoryId = '0'
      value.categoryId = category[0]
    }

    // 获取富文本
    value.detail = this.refRichTextEditor.current.getDetail()
    // 发送请求
    let result
    if (this.isUpdate) {
      value._id = this.state.product._id
      result = await reqUpdateProduct(value)
    } else {
      result = await reqAddProduct(value)
    }
    // 结果
    if (result.status === 0) {
      message.success('操作成功')
      this.props.history.goBack()
    } else {
      message.error('操作失败')
    }
  }

  cascaderLoadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true

    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false

    if (subCategorys && subCategorys.length > 0) {
      const subOptionList = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      targetOption.children = subOptionList
    } else {
      // 没有二级分类
      targetOption.isLeaf = true
    }

    this.setState({})
  }

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.initOptions(categorys)
      } else {
        return categorys
      }
    }
  }

  initOptions = async (categorys) => {
    // 根据categorys生成options数组
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))
    const { isUpdate } = this
    const { product } = this.state
    const { pCategoryId } = product
    if (isUpdate && pCategoryId !== '0') {
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表
      const subOptionList = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      const targetOption = options.find((val) => val.value === pCategoryId)
      targetOption.children = subOptionList
    }
    // 更新options状态
    this.setState({ optionLists: options })
  }
}
