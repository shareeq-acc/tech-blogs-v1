const timer = (time) => {
    const currentTime = Date.now()
    const timeInSeconds = Math.floor((time - currentTime) / 1000)
    if (timeInSeconds <= 0) {
        return "00:00"
    }
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds - (minutes * 60)
    return `${minutes >= 10 ? minutes : "0" + minutes.toString()} : ${seconds >= 10 ? seconds : "0" + seconds.toString()}`
}
export default timer