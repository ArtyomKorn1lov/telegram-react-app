export default class RegisterModel {
    constructor(login, name, password, repeat_password) {
        this.login = login;
        this.name = name;
        this.password = password;
        this.repeat_password = repeat_password;
    }
}