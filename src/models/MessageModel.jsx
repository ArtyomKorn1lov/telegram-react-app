export default class MessageModel {
    constructor(id, text, created, edited, userId, senderId) {
        this.id = id;
        this.text = text;
        this.created = created;
        this.edited = edited;
        this.userId = userId;
        this.senderId = senderId;
    }
}