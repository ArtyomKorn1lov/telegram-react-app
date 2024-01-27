export default class MessageUpdateModel {
    constructor(id, text, userId, senderId) {
        this.id = id;
        this.text = text;
        this.userId = userId;
        this.senderId = senderId;
    }
}