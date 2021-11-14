module.exports = (user) => {
    if (user.female) {
        return 'Hola usuaria: ' + user.name
    } else {
        return 'Hola usuario: ' + user.name
    }
}
