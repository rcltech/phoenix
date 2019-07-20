class Users {
    constructor() {
        this.dataStore = [
            {
                username: "utkarsh867",
                firstname: "Utkarsh",
                lastname: "Goel",
                roomno: "924"
            },
            {
                username: "utkarsh123",
                firstname: "Utkarsh",
                lastname: "Goel",
                roomno: "916"
            }
        ];
    }

    async getUser(id) {
        return this.dataStore.filter((data) => data.username === id)[0]
    }

    async getProp(id, prop) {
        this.getUser(id).then(user => {
            return user[prop];
        });
    }
}

module.exports = Users;