export const calculateReputation = (user) => {
  if (!user || !user.event_attendees || !user.event_reviews) {
    return 0;
  }

  const attendancePoints = user.event_attendees.length * 10;
  
  const reviewPoints = user.event_reviews.reduce((total, review) => {
    const averageRating = (review.venue + review.organization + review.content) / 3;
    return total + averageRating;
  }, 0);

  return Math.round(attendancePoints + reviewPoints);
};