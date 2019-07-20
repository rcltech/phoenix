const Users = require('./users');

class Society{
    constructor(pgClient){
        this.client = pgClient;
    }

    async getSociety(id){
        const response = await this.client.query(`SELECT * FROM public.society WHERE name='${id}'`);
        return response.rows[0]
    }

    async getSocietyMembers(society, dataSources){
        console.log(society);
        const members = society.members;
        return await Promise.all(members.map(async (member) => {
            const user = await dataSources.users.getUser(member);
            console.log(user);
            return user;
        }));
    }
}

module.exports = Society;