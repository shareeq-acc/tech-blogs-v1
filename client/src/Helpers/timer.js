// Accepts a Time (Expects a Future Time) Returns the Countdown till the Future Time

const timer = (time) => {
    const currentTime = Date.now()
    const timeInSeconds = Math.floor((time - currentTime) / 1000) // Diff in seconds
    if (timeInSeconds <= 0) {  // If Time Already Passed Curren Time - No Difference
        return "00:00"
    }
    const minutes = Math.floor(timeInSeconds / 60) // Find Minutes
    const seconds = timeInSeconds - (minutes * 60) // find Seconds
    return `${minutes >= 10 ? minutes : "0" + minutes.toString()} : ${seconds >= 10 ? seconds : "0" + seconds.toString()}`
}
export default timer