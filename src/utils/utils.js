// returns a random integer
// the minimum bound is inclusive
// the maximum bound is exclusive
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function getRandomElement(array) {
    return array[Math.floor(Math.random()*array.length)];
}

module.exports = {getRandomInt, getRandomElement}