class ApiFeactures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }
    filter() {
        const queryObj = { ...this.queryStr }
        const excluderFields = ['page', 'limit', 'sort', 'fields']
        excluderFields.forEach(el => delete queryObj[el])

        let queryStrg = JSON.stringify(queryObj) //Convert query into Json
        queryStrg = queryStrg.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        queryStrg = JSON.parse(queryStrg) //Convert Query in JS in order to get process for mongoose
        this.query = this.query.find(queryStrg)
        return this
    }

    sort() {
        if (this.queryStr.sort) {
            const sortStr = this.queryStr.sort.split(',').join(' ')
            this.query = this.query.sort(sortStr) //Mongoose
        } else {
            this.query = this.query.sort('createdAt') //Mongoose
        }
        return this
    }

    /*    limiting() {
           if (this.queryStr.fields) {
               const limitStr = this.queryStr.split(',').join(' ');
               this.query = this.query.select('name');
               console.log('Enderson Limti')
           } else {
               this.query = this.query.select('-__v')
           }
           return this
       } */

    pagination() {

        const page = this.queryStr.page * 1 || 1
        const limit = this.queryStr.limit * 1 || 100
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit);
        return this
    }
}

module.exports = ApiFeactures;