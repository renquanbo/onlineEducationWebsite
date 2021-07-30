import { List, Spin, BackTop } from "antd";
import { useEffect, useState } from "react";
import { Course } from "../../../../app/model/course";
import courseService from "../../../../app/services/courseService";
import AppLayout from "../../../../components/layout/AppLayout";

import CourseOverview from "../../../../components/course/CourseOverview";
import { Indicator } from "../../../../components/common/styled";
import InfiniteScroll from "react-infinite-scroll-component";

const AllCourses = () => {
  const [paginator, setPaginator] = useState({limit: 20, page: 1});
  const [courses, setCourses] = useState<Course[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchCourseRecords() {
      const { data } = await courseService.getCoursesByPageAndLimit(paginator.page, paginator.limit);
      if (!!data) {
        setCourses(courses.concat(data.courses));
        setHasMore(courses.length < data.total)
      }
    }
    fetchCourseRecords();
  }, [paginator])

  return (
    <AppLayout>
      
      <InfiniteScroll
        next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
        hasMore={hasMore}
        loader={
          <Indicator>
            <Spin size="large" />
          </Indicator>
        }
        dataLength={courses.length}
        endMessage={<Indicator>No More Course!</Indicator>}
        scrollableTarget="contentLayout"
        style={{ overflow: 'hidden' }}
      >
        <List
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={courses}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <CourseOverview {...item}>
              </CourseOverview>
            </List.Item>
          )}
        >
        </List>
      </InfiniteScroll>
      <BackTop target={() => document.getElementById("contentLayout") || window}/>
    </AppLayout>
  )
}

export default AllCourses;