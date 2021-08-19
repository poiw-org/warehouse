import API from "../api";


export default class Item {
    declare _id: string;
    declare title: string;
    declare description: string;
    declare shelf: string;
    declare checkIn: Date;
    declare checkOut: Date;
    declare editedBy: string[];
    declare barcode: string;
    
    constructor(_id: string, title: string,  description?: string, shelf?: string, checkIn?: Date, checkOut?: Date, editedBy?: string[]){
        this._id = _id
        this.title = title
        this.description = description
        this.shelf = shelf
        this.checkIn = checkIn
        this.checkOut = checkOut
        this.editedBy = editedBy
    }

    public async upload(): Promise<void>{
        return new Promise<void>(async (resolve, reject) =>{
            await API.post("/item",{
                _id: this._id,
                title: this.title,
                description: this.description,
                shelf: this.shelf,
                checkIn: this.checkIn,
                checkOut: this.checkOut
            })
        })
    }

    public static async getById(id: string, json: boolean): Promise<Item | object | undefined> {
            try{
                let {data: {_id, title, description, shelf, checkIn, checkOut, editedBy}} = await API.get(`/items/${id}`)
                let item =  new Item(_id, title, description, shelf, checkIn, checkOut, editedBy) 
                if(json) return item.toJSON()
                return item
            }catch(e){
                console.log(e.message);
                
                return undefined
            }

    }

    public toJSON(): object {
        console.log(this)
        return{
            _id: this._id,
            title: this.title,
            description: this.description,
            shelf: this.shelf,
            checkIn: this.checkIn,
            checkOut: this.checkOut,
            editedBy: this.editedBy,
            barcode: this.barcode
        }
    }

    static fromJSON(item: any): Item{
        let {_id, title, description, shelf, checkIn, checkOut, editedBy} = item
        return new Item(_id, title, description, shelf, checkIn, checkOut, editedBy)
    }

    public static async  search(term: string): Promise<Item[]>{
        let {data} = await API.get("/items",{term})
        return data.map((item: any)=>{
            let {_id, title, description, shelf, checkIn, checkOut, editedBy} = item
            new Item(_id, title, description, shelf, checkIn, checkOut, editedBy)
        })
    }
}