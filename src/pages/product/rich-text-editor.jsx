import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { baseURL } from '../../api'

export default class RichTextEditor extends Component {
  constructor(props) {
    super(props)
    const html = this.props.detail
    if (html) {
      const contentBlock = htmlToDraft(html)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState,
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      }
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', baseURL + '/manage/img/upload')
      const data = new FormData()
      data.append('image', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText)
        if (response.status === 0) {
          // 取出url
          const { url } = response.data
          const newUrl = url.replace(/^http:\/\/localhost:\d+/, 'http://10.193.194.29:5000')
          resolve({ data: { link: newUrl } })
        } else {
          reject(response.error)
        }
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  render() {
    const { editorState } = this.state
    return (
      <Editor
        editorState={editorState}
        editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10 }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {
            urlEnabled: true,
            uploadEnabled: true,
            uploadCallback: this.uploadCallback,
          },
        }}
      />
    )
  }
}
