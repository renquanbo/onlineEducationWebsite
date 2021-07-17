## Questions 07/07/2021 - 10/07/2021
---
- [x] 如何用typescript的方式来调用axios库
- [x] 从axios返回的error怎么处理
- [x] ~~需要在调用logout接口时，传入什么参数吗（目前一直返回403)~~ 
    - 已解决：需要在请求时 headers里加入token
- [x] 是不是不能直接调用https://cms.chtoma.com/api/students (这个请求目前返回code 500) 是不是需要加一些请求参数

## Questions 11/07/2021 - 13/07/2021
- [ ] 关于 null 或者 undefined 怎么处理
    - 一方面是函数返回的null 或者 undefined
    - 另一方面是函数产生null或者undefined时 怎么处理

## Questions 11/07/2021 - 13/07/2021
- union type 参数的兼容性问题  具体例子在 antd 的table 里的 columns 里面的onFilter这个属性，它的定义为
```typescript
    onFilter?: (value: string | number | boolean, record: RecordType) => boolean;
```
我传入的参数为
```typescript
    onFilter: (value: string, record: Student) => record.type.name === value,
```
此时编译不通过

- 动态设置filters的问题  调用react的state作为filters的参数时，此时的state为undefined