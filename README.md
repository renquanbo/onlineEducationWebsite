## Tasks 06/07/2021 - 10/07/2021
---
### Task 1 *login* 

-  ~~拿到表单里的数据~~
    -   ~~加密password~~
    -   ~~调用接口 post 请求 api/login~~ 
        -   ~~成功 保存用户状态 信息 localStorage~~
            - ~~跳转 /dashboard~~
        -   ~~失败 提示用户 用户名 密码 不匹配~~

### Task 2 *dashboard 界面*
-  ~~layout ~~
    -  ~~sidebar ~~
        - ~~logo~~
        - ~~menu~~
        
    -  ~~header ~~
        - ~~折叠sidebar 按钮~~
        - 通知 
        - ~~logout~~
            - logo
            - ~~功能~~
                ~~logout~~ 
                -  ~~注销用户 登录状态 调用接口 api/logout~~
                -  ~~跳转路由  /login~~
-  student 数据展示
    - ~~添加表格~~
    - ~~调用接口~~
    - render data 

## Tasks 11/07/2021 - 13/07/2021
---
### 抽象出公用的model
- 通用的IResponse
    - LoginResponse
- LoginRequest
- Role
### 抽象出公用的service 实现view层和api调用解耦
- BaseApiService
    - 创建公用的axios instance
        - 添加公用的api地址
        - 添加request拦截器 在非login请求中 加入authorization token 到 headers
        - 添加response拦截器 添加处理error入口
        - 添加公用的get, post 方法
    - 添加errorHandler
- 添加用户信息存储的服务 storage
- AuthService
    - login 方法
    - logout 方法
- StudentService
    - getStudents


## Tasks 14/07/2021 - 17/07/2021
---
- 实现分页渲染
    - 添加paginator，total state
    - 在table组件中加入pagination参数
    - 使用useEffect，在里面调用getStudents方法获取students list，并设置paginator作为useEffect触发条件
- 实现join time时间日期描述
    - 引入date-fns
    - 调用 formatDistanceToNow 方法 
- 实现student name 排序（当前页）
    - 在columns数组的name元素中加入sorter方法，以名字的首字母的charCode值为排序标准
- 实现地区名称过滤
    - 在Area元素中加入filters数组和onFilter方法
- 实现student type过滤
    - 在type元素中加入filters数组和onFilter方法
- 实现students name模糊搜索
    - 添加Search组件
    - 添加以name为参数的api接口方法
    - 实现onSearch
        - 直接调用方法查询
    - 实现onChange
        - 引入lodash debounce 实现延迟1s查询
- 实现add，edit student
    - 引入modal组件
    - 添加form到modal中
    - 实现add，update 接口方法
- 实现delete student