export default class MessageCreateModel {
    constructor(text, userId, senderId) {
        this.text = text;
        this.userId = userId;
        this.senderId = senderId;
    }
}