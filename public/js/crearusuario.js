/* const cons = require("consolidate")
 */
const stats = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users',
        })
        console.log(res)
    } catch (err) {
        console.log(err)
    }
}

stats()