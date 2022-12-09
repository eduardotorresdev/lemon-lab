export const getTimeString = (seconds: number|null) => {
    if(!seconds) return ''

    let minutes = Math.floor(seconds / 60);
    let extraSeconds = seconds % 60;

    const string = [`${extraSeconds.toFixed(5)}s`];
    if (minutes !== 0)
        string.unshift(`${minutes}m`)

    return string.join(' ')
}

export const getRateString = (rate: number|null) => {
    if(!rate) return ''

    return `${rate.toFixed(2)}/s`
}