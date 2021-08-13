import { Col, Input, Row, Select, Spin, Tabs, Typography } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Course } from "../../../../app/model/course";
import AppLayout from "../../../../components/layout/AppLayout";
import AddCourseForm from "../../../../components/course/AddCourseForm";
import UpdateChapterForm from "../../../../components/course/UpdateChapterForm";
import { debounce } from "lodash";
import courseService from "../../../../app/services/courseService";
import storage from "../../../../app/services/storage";


const {Option} = Select;

const EditCourse = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchBy, setSearchBy] = useState<'uid' | 'name' | 'type'>('uid');
  const [searchResult, setSearchResult] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>(null);
  const router = useRouter();
  const search = useCallback(
    debounce((value: string,  cb?: (courses?: Course[]) => void) => {
      if (!value) {
        return;
      }

      setIsSearching(true);
      courseService
        .getCourses({ [searchBy]: value, userId: storage.userInfo.userId })
        .then((res) => {
          const {data} = res;

          if(!!data) {
            setSearchResult(data.courses);
            if (!!cb) {
              cb(data.courses);
            }
          }
        })
        .finally(() => {setIsSearching(false)});
    }, 1000),
    [searchBy]
  );

  useEffect(() => {
    const { uid } = router.query;

    if (uid) {
      search(uid as string, (courses) => {
        setCourse(courses[0]);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      <Row gutter={[6, 16]}>
        <Col span={12} style={{ marginLeft: '1.6%' }}>
          <Input.Group compact size="large" style={{ display: 'flex' }}>
            <Select defaultValue="uid" onChange={(value) => setSearchBy(value)}>
              <Option value="uid">Code</Option>
              <Option value="name">Name</Option>
              <Option value="type">Category</Option>
            </Select>
            <Select
              placeholder={`Search course by ${searchBy}`}
              notFoundContent={isSearching ? <Spin size="small" /> : null}
              filterOption={false}
              showSearch
              onSearch={(value) => search(value)}
              style={{ flex: 1 }}
              onSelect={(id) => {
                const course = searchResult.find((item) => item.id === id);

                setCourse(course);
              }}
            >
              {searchResult.map(({ id, name, teacherName, uid }) => (
                <Select.Option key={id} value={id}>
                  {name} - {teacherName} - {uid}
                </Select.Option>
              ))}
            </Select>
          </Input.Group>
        </Col>
      </Row>
      <Tabs
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} style={{ marginLeft: '1.6%', marginTop: '16px'}} />
        )}
        type="card"
        size="large"
        animated
      >
        <Tabs.TabPane key="course" tab="Course Detail">
          <AddCourseForm course={course} isUpdate={true}/>
        </Tabs.TabPane>

        <Tabs.TabPane key="chapter" tab="Course Schedule">
          <UpdateChapterForm courseId={course?.id} scheduleId={course?.scheduleId} isAdd={false} />
        </Tabs.TabPane>
      </Tabs>
    </AppLayout>
  )
}

export default EditCourse;