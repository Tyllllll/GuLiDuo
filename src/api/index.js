/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是Promise
 */
import ajax from './ajax'

export const baseURL = 'http://10.193.194.29:5000'
// 1.登录
export const reqLogin = (username, password) =>
  ajax(baseURL + '/login', { username, password }, 'POST')
// 2.添加用户
export const reqAddUser = (user) => ajax(baseURL + '/manage/user/add', user, 'POST')
// 3.更新用户
export const reqUpdateUser = (user) => ajax(baseURL + '/manage/user/update', user, 'POST')
// 4.获取所有用户列表(要带_id)
export const reqUserList = () => ajax(baseURL + '/manage/user/list')
// 5.删除用户
export const reqDeleteUser = (userId) => ajax(baseURL + '/manage/user/delete', { userId }, 'POST')
// 6.获取一级或某个二级分类列表
export const reqCategorys = (parentId) => ajax(baseURL + '/manage/category/list', { parentId })
// 7.添加分类
export const reqAddCategorys = (categoryName, parentId) =>
  ajax(baseURL + '/manage/category/add', { categoryName, parentId }, 'POST')
// 8.更新品类名称
export const reqUpdateCategorys = (categoryName, categoryId) =>
  ajax(baseURL + '/manage/category/update', { categoryName, categoryId }, 'POST')
// 9.根据分类ID获取分类
export const reqCategoryName = (categoryId) =>
  ajax(baseURL + '/manage/category/info', { categoryId })
// 10.获取商品分页列表
export const reqProducts = (pageNum, pageSize) =>
  ajax(baseURL + '/manage/product/list', { pageNum, pageSize })
// 11.搜索商品分页列表(searchType只能是productName或productDesc，字符串)
export const reqSearchProducts = (pageNum, pageSize, searchName, searchType) =>
  ajax(baseURL + '/manage/product/search', { pageNum, pageSize, [searchType]: searchName })
// 12.添加商品
export const reqAddProduct = ({ categoryId, pCategoryId, name, desc, price, detail, imgs }) =>
  ajax(
    baseURL + '/manage/product/add',
    {
      categoryId,
      pCategoryId,
      name,
      desc,
      price,
      detail,
      imgs,
    },
    'POST'
  )
// 13.更新商品
export const reqUpdateProduct = ({
  _id,
  categoryId,
  pCategoryId,
  name,
  desc,
  price,
  detail,
  imgs,
}) =>
  ajax(
    baseURL + '/manage/product/update',
    {
      _id,
      categoryId,
      pCategoryId,
      name,
      desc,
      price,
      detail,
      imgs,
    },
    'POST'
  )
// 14.对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) =>
  ajax(baseURL + '/manage/product/updateStatus', { productId, status }, 'POST')
// 16.删除图片
export const reqDeletePic = (name) => ajax(baseURL + '/manage/img/delete', { name }, 'POST')
// 17.添加角色
export const reqAddRole = (roleName) => ajax(baseURL + '/manage/role/add', { roleName }, 'POST')
// 18.获取角色列表
export const reqRoleList = () => ajax(baseURL + '/manage/role/list')
// 19.更新角色（给角色设置权限）
export const reqUpdateRole = (_id, auth_name, menus) =>
  ajax(baseURL + '/manage/role/update', { _id, auth_name, menus }, 'POST')
// 20.获取天气信息高德API
export const reqWeather = () => {
  return ajax('https://restapi.amap.com/v3/weather/weatherInfo', {
    key: '20766529d7841ce784455a79df6b9211',
    city: '320102',
    extensions: 'base',
    output: 'json',
  })
}
