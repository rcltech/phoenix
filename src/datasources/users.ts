class Users {
    private pool:any;
    private table:string;

    constructor(pool, table?:string) {
        this.pool = pool;
        this.table = table || 'public.user'
    }

    async getUser(id) {
        const response = await this.pool.query(
            `SELECT * FROM ${this.table} WHERE username='${id}'`,
        );
        return response.rows[0];
    }

    async getProp(id, prop) {
        this.getUser(id).then(user => {
            return user[prop];
        });
    }

    async addUser(newUser) {
        const user = JSON.parse(JSON.stringify(newUser));
        const response = await this.pool.query(
            `INSERT INTO ${this.table} (
            username, email, "imageUrl", phone, firstname, lastname, roomno) VALUES (
            $1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text)
            returning username;`,
            [user.username, user.email, user.imageUrl, user.phone, user.firstname, user.lastname, user.roomno],
        );
        return user
    }
}

export default Users;
