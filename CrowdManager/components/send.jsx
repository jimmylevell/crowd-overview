import { useState, useEffect } from 'react';

export default function Send() {
    const MAX_LENGTH = 999 // for sponsored by
    const MAX_LENGTH_RECIPIENTS = 250;

    const [loading, setLoading] = useState();
    const [phonenumbers, setPhonenumbers] = useState('');
    const [message, setMessage] = useState('');
    const [result, setResult] = useState({ error: false, message: '' });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const phonenumbers = urlParams.get('phonenumbers');
        const message = urlParams.get('message');

        if (phonenumbers) setPhonenumbers(phonenumbers);
        if (message) setMessage(message);
    })

    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = {
            phonenumbers: phonenumbers,
            message: message,
        }
        const JSONdata = JSON.stringify(data)
        const endpoint = '/api/send'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata,
        }

        try {
            setLoading(true)
            const response = await fetch(endpoint, options)
            const json = await response.json()
            if (json.response === 'success') {
                setResult({ error: false, message: 'Message sent!' })

                setLoading(false)
                setPhonenumbers('')
                setMessage('')
            } else {
                setLoading(false)
                setResult({ error: true, message: "Error sending message" })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onChange = (event) => {
        const { name, value } = event.target
        if (name === 'phonenumbers') {
            setPhonenumbers(value)
            if (value.split(',').length >= MAX_LENGTH_RECIPIENTS) {
                return setResult({ error: true, message: `Max ${MAX_LENGTH_RECIPIENTS} recipients` })
            } else {
                return setResult({ error: false, message: '' })
            }
        } else if (name === 'message') {
            setMessage(value)
        }
    }

    return (
        <div className="container">
            <div className="row">
                <form onSubmit={handleSubmit}>
                    <div className="form-group mt-2">
                        <label htmlFor="phonenumbers" >Phone Numbers (comma separated)</label>
                        <input type="tel" id="phonenumbers" className="form-control" name="phonenumbers" placeholder="Please provide Phonenumbers" value={phonenumbers} onChange={onChange} required />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="message">Message</label>
                        <textarea className="form-control" id="message" name="message" rows="3" value={message} onChange={onChange} maxLength={MAX_LENGTH} required></textarea>
                    </div>
                    <div className="form-group mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'sending...' : 'Send SMS'}</button>
                    </div>
                </form>
            </div>
            <div className="row mt-3">
                {result.error && <div className="alert alert-danger" role="alert">{result.message}</div>}
                {!result.error && result.message.length > 0 && <div className="alert alert-success" role="alert">{result.message}</div>}
            </div>
        </div>
    )
}
