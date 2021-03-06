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
---

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
---

## Tasks 18/07/2021 - 20/07/2021
---
- menu以及sub menu
    - menuConfig 里的每一个menuItem 都需要有 路由，key，icon，title或者label，subMenu
        - 可以把路由当做key,但这里会有重复key的问题，需要后面解决一下
    - 渲染时 
        - 有subMenu 渲染subMenu
        - 无subMenu 直接渲染Menu.Item
        - 拿到当前路由地址来判断defaultSelectedKeys 和 defaultOpenKeys
            - 超过两级路由时
                - 最后一级路由作为 defaultSelectedKeys
                - 最后一级路由的上一级路由 作为defaultOpenKeys
- student details 界面
    - 添加路由到指定id的student页面
    - 拿到路由query里的student id
    - 发请求拿到单个 student 数据
    - 添加相关组件并渲染数据
- breadcrumb
    - 拿到路由当前的pathname
    - 匹配pathname对应的breadcrumb数组
    - 用数组的map方法渲染breadcrumb组件

## Tasks 25/07/2021 - 27/07/2021
---
- 用户登录，得到role
    - 跳转到对应的路由
    - 根据role 渲染side nav
      - 每个菜单项的路由，key
      - 对于defaultSelectedKeys 和 defaultOpenKeys，拿到path后
        - 去掉 id 参数
    - 根据path 渲染breadcrumb
      - 生成面包屑数组
      - 详情页 添加detail到数组里
      - 非详情页 最后一个元素去掉link

## Tasks 28/07/2021 - 31/07/2021
---
- 课程首页
  - 建课程model
  - 写api调用函数
  - 调用api 获取课程列表
  - 渲染课程列表
- 抽象公用的获取列表useListEffect函数  目的：代码复用，减少相同代码
    - 类型：request 类型, response 类型, response里的data数据类型
    - 参数 apiRequest function
    - 公用函数 useEffect
    - 返回值 包括 
        - data(学生 课程 或者其他)
        - loading状态
        - total 列表项目总数
        - set状态的方法（setPaginator, setTotal等等)
## Tasks 1/08/2021 - 3/08/2021
---
- course details 界面
    - 根据api添加course model
    - 添加getCourseById方法
    - 添加路由到指定id的course页面
    - 拿到路由query里的course id
    - 发请求拿到单个 course 数据
    - 添加相关组件并渲染数据

## Tasks 18/08/2021 - 21/08/2021
---
- Languages 柱状图
    
    - 根据teacher skills里的数据
        - 拿到teacher skills 里面的 keys 生成key pair 数组，并以keys生成 x轴
    - 遍历 skills生成的key pair数组 根据skill level 生成skill des 数组
        - 有skill 描述 把amount添加到对应数组中
        - 无skill 描述 amount 为0 添加到对应数组中
    - 把这5个 skillDes 数组作为series里的数据 stack 为 teacher

    - students里的interest 数组为另一组数据 stack 为 interest