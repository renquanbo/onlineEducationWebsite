import { Badge, Button, Col, Dropdown, List, notification, Row, Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Message, MessagesRequest, MessagesResponse, MessageType } from "../../app/model/message";
import messageService from "../../app/services/messageService";
import { useListEffect } from "../custom-hooks/list-effect";
import styled from 'styled-components';
import { BellOutlined } from "@ant-design/icons";
import Link from "next/link";
import storage from "../../app/services/storage";

const HeaderIcon = styled.span`
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
  }
`;

const TabNavContainer = styled.div`
  margin-bottom: 0;
  padding: 10px 20px 0 20px;
  .ant-tabs-nav-list {
    width: 100%;
    justify-content: space-around;
  }
`;

const TabPane = styled(Tabs.TabPane)`
  position: relative;
  .ant-list-item {
    padding: 10px 20px;
    cursor: pointer;
    &:hover {
      background: #1890ff45;
    }
  }
  .ant-list-item-meta-title {
    margin-bottom: 0;
  }
  .ant-list-item-action {
    margin: 0 0 0 48px;
  }
  .ant-list-item-meta-avatar {
    align-self: flex-end;
  }
  .ant-list-item-meta-description {
    margin: 5px 0;
    white-space: normal;
    display: -webkit-box;
    max-height: 3em;
    max-width: 100%;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ant-list-item-meta {
    margin-bottom: 0;
  }
`;

const Footer = styled(Row)`
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 4px 4px;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-right: none;
  background: #fff;
  z-index: 9;
  .ant-col {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      box-shadow: 1px 0 0 0 #f0f0f0;
    }
  }
  button {
    border: none;
  }
`;


const MessageContainer = styled.div`
  height: 380px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

interface MessagesProps {
  type: MessageType;
  scrollTarget: string;
  clearAll: number;
  onRead?: (amount: number) => void;
  message?: Message;
}

function Messages(props: MessagesProps): JSX.Element {
  const { paginator, setPaginator, hasMore, data, setData } = useListEffect<
    MessagesResponse,
    Message
  >(messageService.getMessages.bind(messageService), 'messages', false);

  return (
    <InfiniteScroll
      next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
      hasMore={hasMore}
      loader={
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      }
      dataLength={data.length}
      endMessage={<div style={{ textAlign: 'center' }}>No more</div>}
      scrollableTarget={props.scrollTarget}
    >
      <List></List>
    </InfiniteScroll>
  );
}

export default function MessagePanel() {
  const types: MessageType[] = ['notification', 'message'];
  const [activeType, setActiveType] = useState<MessageType>('notification');
  const [clean, setClean] = useState<{ [key in MessageType]: number }>({
    notification: 0,
    message: 0,
  });
  const [message, setMessage] = useState<Message>(null);
  useEffect(() => {
    const sse = messageService.messageEvent();

    sse.onmessage = (event) => {
      let { data } = event;

      data = JSON.parse(data || {});
      if (data.type !== 'heartbeat') {
        const content = data.content as Message;

        if (content.type === 'message') {
          notification.info({
            message: `You have a message from ${content.from.nickname}`,
            description: content.content,
          });
        }
      }
    }

    return () => {
      sse.close();
    }
  }, [])

  return (
    <Badge size="small" count={0} offset={[10, 0]} >
      <HeaderIcon>
        <Dropdown
          overlayStyle={{
            background: '#fff',
            borderRadius: 4,
            width: 400,
            height: 500,
            overflow: 'hidden',
          }}
          placement="bottomRight"
          trigger={['click']}
          overlay={
            <>
              <Tabs
                renderTabBar={(props, DefaultTabBar) => (
                  <TabNavContainer>
                    <DefaultTabBar {...props} />
                  </TabNavContainer>
                )}
                onChange={(key: string) => {
                  if (key !== activeType) {
                    setActiveType(key as MessageType);
                  }
                }}
                animated
              >
                {types.map((type) => (
                  <TabPane key={type} tab={type}>
                    <MessageContainer id={type}>
                      <Messages
                        type={type}
                        scrollTarget={type}
                        clearAll={clean[type]}

                        message={message}
                      />
                    </MessageContainer>
                  </TabPane>
                ))}
              </Tabs>

              <Footer style={{ alignContent: 'middle', justifyContent: 'middle' }}>
                <Col span={12}>
                  <Button onClick={() => { }}>
                    Mark all as read
                  </Button>
                </Col>
                <Col span={12}>
                  <Button>
                    <Link href={`/dashboard/${storage.userInfo.role}/message`}>View history</Link>
                  </Button>
                </Col>
              </Footer>
            </>
          }
        >
          <BellOutlined style={{ fontSize: 24, marginTop: 5 }} />
        </Dropdown>

      </HeaderIcon>
    </Badge>
  );
}