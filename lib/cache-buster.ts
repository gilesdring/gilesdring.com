export function timeStamp() {
    const timeStamp = Temporal.Now.instant();
    return timeStamp.epochMilliseconds.toString();
}