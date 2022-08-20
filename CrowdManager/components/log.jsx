import { useState, useEffect } from 'react';

export default function Log() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/log')
            .then(res => res.json())
            .then(data => {
                setLogs(data.logs);
                setLoading(false);
            })
    }, []);

    return (
        <div>
            <h1>Logs</h1>
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
                    {loading ? <tr><td>Loading...</td></tr> : logs.map(log => (
                        <tr key={log._id}>
                            <td>{log.email}</td>
                            <td>{log.phonenumbers}</td>
                            <td>{log.message}</td>
                            <td>{log.createdAt}</td>
                        </tr>
                    )
                    )}
                </tbody>
            </table>
        </div>
    )
}
