const maxlength = 1000000

export function userGenerate (id) {
    return {
        id: id.toString(),
        name: `User name id${id}`,
        avatarUrl: `https://placeimg.com/40/40/people/${id}`
    }
}

export function userListGenerate (count = 20, _from = 0) {
    let result = []
    let limit = _from + count

    for (let i = _from; i < limit; i++) {
        result.push(userGenerate(i))
    }
    return result
}

export function getUserListByName (name, limit = 20, offset = 0) {
    let result = []
    let regExp = new RegExp(name, 'i')

    while (result.length !== limit && offset < maxlength) {
        let user = userGenerate(offset)

        if (user.name.search(regExp) > -1) {
            result.push(user)
        }

        offset++
    }

    return result
}
