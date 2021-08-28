import { List, Spin, BackTop, Button } from "antd";
import { Course, CourseRequest, CourseResponse } from "../../../../app/model/course";
import courseService from "../../../../app/services/courseService";
import AppLayout from "../../../../components/layout/AppLayout";

import CourseOverview from "../../../../components/course/CourseOverview";
import { Indicator } from "../../../../components/common/styled";
import InfiniteScroll from "react-infinite-scroll-component";
import { useListEffect } from "../../../../components/custom-hooks/list-effect";
import Link from "next/link";
import storage from "../../../../app/services/storage";

const AllCourses = () => {
  const {data, paginator, setPaginator, hasMore} = useListEffect
    <CourseRequest, CourseResponse, Course> 
    (courseService.getCourses.bind(courseService), "courses", false);

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
        dataLength={data.length}
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
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <CourseOverview {...item}>
                <Link href={`/dashboard/${storage.userInfo?.role}/courses/${item.id}`} passHref>
                  <Button type="primary" style={{marginTop: "8px"}}>Read More</Button>
                </Link>
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