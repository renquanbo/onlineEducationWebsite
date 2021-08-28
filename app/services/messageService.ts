import { IResponse } from "../model/api";
import { MessagesRequest, MessagesResponse, MessageStatisticResponse } from "../model/message";
import { BaseApiService } from "./baseApiService";
import storage from "./storage";

class MessageService extends BaseApiService {
  getMessages(params?: MessagesRequest):Promise<IResponse<MessagesResponse>> {
    return this.get('message', params);
  }

  getMessageStatistic(userId?: number): Promise<IResponse<MessageStatisticResponse>> {
    return this.get<IResponse<MessageStatisticResponse>>('message/statistics', {userId: userId});
  }

  markAsRead(ids: number[]): Promise<IResponse<boolean>> {
    return this.put('message', { status: 1, ids });
  }

  messageEvent(): EventSource {
    return new EventSource(`https://cms.chtoma.com/api/message/subscribe?userId=${storage.userInfo.userId}`, {
      withCredentials: true,
    });
  }
}

const messageService = new MessageService();
export default messageService;