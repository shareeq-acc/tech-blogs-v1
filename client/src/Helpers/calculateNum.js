// This Function Accepts a Number and then return a Short String with a Unit Symbol (if the Number is Large) - e.g return 1.2k if given 1200 
// Else Just Returns the Number - e.g when given 987 returns 987
// Used for Displaying The Total Number of Likes, Comments etc

const calculateNumber = (number) => {
    if (Math.abs(number) >= 1000000) {
        return Math.sign(number) * ((Math.abs(number) / 1000000).toFixed(1)) + 'M'
    }
    else if (Math.abs(number) >= 1000) {
        return Math.sign(number) * ((Math.abs(number) / 1000).toFixed(1)) + 'K'
    }
    else {
        return number
    }
}

export default calculateNumber
