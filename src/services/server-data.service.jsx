import MessageModel from '../models/MessageModel';
import UserModel from '../models/UserModel';

const ServerDataService = {
    apiUrl: "http://localhost:3001/",

    convertTelegramMessages: function(serverData) {
        return serverData.map((el) => this.convertTelegramMessage(el));
    },
    convertTelegramMessage: function(data) {
        return new MessageModel(
            data.Id,
            data.Text,
            new Date(data.CREATED),
            new Date(data.EDITED),
            data.AuthorId,
            data.SenderId
        );
    },
    convertTelegramUsers: function(serverData) {
        return serverData.map((el) => this.convertTelegramUser(el));
    },
    convertTelegramUser: function(data) {
        return new UserModel(
            data.Id,
            data.Login,
            data.Name
        )
    }
};

export default ServerDataService;