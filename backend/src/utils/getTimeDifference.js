module.exports = function getTimeDifference(startTime, endTime) {
  const dummyDate = "2026-01-01T";
  const startDate = new Date(`${dummyDate}${startTime}`);
  const endDate = new Date(`${dummyDate}${endTime}`);
  let diffInMs = endDate - startDate;

  if (diffInMs < 0) {
    diffInMs += 24 * 60 * 60 * 1000; 
  }

  const totalMinutes = Math.floor(diffInMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  return {totalMinutes, hours}
}