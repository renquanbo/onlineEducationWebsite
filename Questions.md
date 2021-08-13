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

## Questions 28/07/2021 - 31/07/2021
```typescript
export default function CourseOverview(
  props: React.PropsWithChildren<Course> & { cardProps?: CardProps }
) {
    /** code */
}
```
> 这里的 & 怎么理解 
- 我的理解是 把cardProps 里的属性加到前面的以Course为类型的props里面

## Questions 1/08/2021 - 3/08/2021
```typescript
const [courseDetail, setCourseDetail] = useState<CourseDetail>(null);
// 这里会报错 
// Argument of type 'null' is not assignable to parameter of type 'CourseDetail | (() => CourseDetail)
```
我理解他报错是因为，在tsconfig里 "strict"为true的时候，"strictNullChecks" 也是true，此时null不是所有类型的子类型，所以不兼容CourseDetail
然后我把 "strictNullChecks" 设置为false，编译可通过，但也引来以下的思考
- 此时有没有副作用，会不会是自己挖了个坑在这
- 我也试了另一种方法让编译器通过，就是在调用 courseDetail时 使用非空断言  {...courseDetail!}
    - 这两种方法孰优孰劣（我个人认为这两个方法本质上是一样的，应该都没有从根本上解决问题)


## Questions 4/08/2021 - 6/08/2021
```typescript
<InputNumber
    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
    min={0}
    style={{ width: '100%' }}
>
</InputNumber>
```
这里在parser里的那个函数会报错，报错信息为 `Type 'string' is not assignable to type '0'` 这里不能理解，为什么会把min里的0 当做一个类型
但是并不影响程序运行, 是否与tsconfig 有关

## Questions 11/08/2021 - 14/08/2021
关于typescript 类型的思考，比如 这个方法`updateCourse(req: UpdateCourseRequest)` 参数类型是 `UpdateCourseRequest` 其定义是

```typescript
export interface UpdateCourseRequest {
  id: number;
}
```
在调用时用的是 `courseService.updateCourse({...request, id: course.id})`
这里的原因是因为只要有`id`这个属性，那么`{...request, id: course.id}`这个参数就可以当做`UpdateCourseRequest` 这个类型吗

另一问题是 关于 `lib/util/table-helper.ts`里的`genCommonTableProps`这个函数怎么理解，它是不是一个克里化的函数，如果是, 那么中间的
```typescript
TableProps<any> = ({
  columns,
  data,
  paginator,
  total,
  loading,
  setPaginator,
  rowKey = 'id',
})
```
怎么理解, 它是一个函数的传入参数声明吗