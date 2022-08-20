import { useState, useEffect } from 'react';

export default function Log(props) {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState();

  useEffect(() => {
    setId(props.id);
    fetch('/api/measurements/' + id)
      .then(res => res.json())
      .then(data => {
          setMeasurements(data);
          setLoading(false);
      })
  }, []);

  return (
    <div>
      <h1>Measurement of Checkpoint {id}</h1>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>User</th>
            <th>Phonenumbers</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td>Loading...</td></tr> : measurements.map(measurement => (
            <tr key={measurement._id}>
              <td>{measurement.email}</td>
              <td>{measurement.phonenumbers}</td>
              <td>{measurement.message}</td>
              <td>{measurement.createdAt}</td>
            </tr>
          )
          )}
        </tbody>
      </table>
    </div>
  )
}
