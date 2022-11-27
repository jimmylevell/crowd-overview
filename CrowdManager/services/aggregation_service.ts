export async function getAggregations() {
  return fetch('/api/aggregation')
    .then((res) => res.json())
    .then((data) => {
      return data['aggregations']
    })
}

export async function getAggregationsByTimeSlot(timeSlot: Date) {
  return fetch('/api/aggregation/' + timeSlot)
    .then((res) => res.json())
    .then((data) => {
      return data['aggregations']
    })
}
