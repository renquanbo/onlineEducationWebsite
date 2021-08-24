import { IResponse } from "../model/api";
import { MessagesRequest, MessagesResponse } from "../model/message";
import { BaseApiService } from "./baseApiService";
import storage from "./storage";

class MessageService extends BaseApiService {
  getMessages(params?: MessagesRequest):Promise<IResponse<MessagesResponse>> {
    return this.get('message', params);
  }

  messageEvent(): EventSource {
    return new EventSource(`https://cms.chtoma.com/api/message/subscribe?userId=${storage.userInfo.userId}`, {
      withCredentials: true,
    });
  }
}

const messageService = new MessageService();
export default messageService;