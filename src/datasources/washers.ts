class Washers{
    private pool;
    private table;
    constructor(pool, table?:string){
        this.pool = pool;
        this.table = table || 'public.washers';
    }

    async getWasher(id:number){
        const query:string = `SELECT * FROM ${ this.table } WHERE id=${id}`;
        const response = await this.pool.query(query);
        return response.rows[0];
    }
}

export default Washers