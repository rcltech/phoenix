class Users {
    constructor(pgClient) {
        this.client = pgClient;
    }

    async getUser(id) {
        const response = await this.client.query(
            `SELECT * FROM public.users WHERE username='${id}'`
        );
        return response.rows[0];
    }

    async getProp(id, prop) {
        this.getUser(id).then(user => {
            return user[prop];
        });
    }
}

module.exports = Users;
