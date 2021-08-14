// Check if a string contains common punctuation
function containsPunctuation(string) {
    const punctuation = '.,?!:;#$%^&*+-[]';
    for (let i = 0; i < punctuation.length; i += 1) {
        if (string.includes(punctuation[i])) return true;
    }
    return false;
}

// Check if a string is composed entirely of numbers
function isNumber(string) {
    return string.match(/^[0-9]+$/) != null;
}

// Ensure a hashtag is valid
// See: https://help.twitter.com/en/using-twitter/how-to-use-hashtags
const isHashtagValid = (hashtag) => {
    return hashtag.length !== 0 && !isNumber(hashtag) && !hashtag.includes(' ')
    && !containsPunctuation(hashtag);
};

module.exports = {
    isHashtagValid
};