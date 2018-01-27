import {userListGenerate, getUserListByName} from '@/mock-data/user.js'

export default {

    // Get user
    // ['GET */api/user/:id'] (pathMatch, query, request) {
    //     return {
    //         body: JSON.stringify({
    //             result: userGenerate(pathMatch.id)
    //         }),
    //         status: 200,
    //         statusText: 'OK',
    //         headers: {},
    //         delay: 1500 // millisecond
    //     }
    // },

    // Get users
    ['GET *api/users'] (pathMatch, query, request) {
        let searchTerm = request.params.searchTerm
        let lastId = parseInt(request.params.lastId)
        let limit = 20

        let users = []

        if (lastId && lastId > 0) {
            lastId += 1
        } else {
            lastId = 0
        }

        if (searchTerm) {
            users = getUserListByName(searchTerm, limit, lastId)
        } else {
            users = userListGenerate(limit, lastId)
        }

        let body = {
            result: users,
            last: (users.length < limit),
            nextPageUrl: '',
            previousPageUrl: ''
        }

        return {
            body: JSON.stringify(body),
            status: 200,
            statusText: 'OK',
            headers: {},
            delay: 1500 // millisecond
        }
    }
}
