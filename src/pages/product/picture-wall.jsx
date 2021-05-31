import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { baseURL, reqDeletePic } from '../../api'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default class PicturesWall extends Component {
  constructor(props) {
    super(props)

    const { imgs } = this.props
    const fileList = imgs.map((val, index) => ({
      uid: -index - 1,
      name: val,
      status: 'done',
      url: baseURL + '/upload/' + val,
    }))
    this.state = {
      previewVisible: false, // 标识是否显示大图预览
      previewImage: '',
      previewTitle: '',
      fileList,
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }

  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      const result = file.response
      if (result.status === 0) {
        message.success('上传图片成功！')
        const { name, url } = result.data
        // 修正file的name, url
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeletePic(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }
    this.setState({ fileList })
  }

  // 获取fileList的名字
  getImgs = () => {
    return this.state.fileList.map((file) => file.name)
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )
    return (
      <>
        <Upload
          action={baseURL + '/manage/img/upload'}
          accept='image/*'
          name='image'
          listType='picture-card'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    )
  }
}
