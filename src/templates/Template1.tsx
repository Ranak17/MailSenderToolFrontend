import React from 'react';

const Template1 = () => {
    return (
        <div
            style={{
                background: 'white',
                color: 'black',
                position: 'relative',
                height: '100%',
            }}
        >
            <div
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    textAlign: 'center',
                    padding: '20px',
                }}
            >
                <h1>Your Email Header</h1>
            </div>
            <div
                style={{
                    padding: '2rem',
                    display: 'grid',
                    gap: '.8rem',
                }}
            >
                <h2>Welcome to Our Service!</h2>
                <p>Dear [User],</p>
                <p>We are excited to have you on board! Here are some details about your account:</p>
                <ul>
                    <li>Account ID: [ID]</li>
                    <li>Email: [User Email]</li>
                </ul>
                <p>
                    If you have any questions, feel free to reach out to us.{' '}
                    <a href="[Action URL]">Click here to get started</a>
                </p>
            </div>
            <div
                style={{
                    backgroundColor: '#333',
                    color: 'white',
                    textAlign: 'center',
                    padding: '10px',
                    bottom: '0',
                    position: 'absolute',
                    width: '100%',
                }}
            >
                <p>© 2024 Your Company Name. All rights reserved.</p>
                <p>
                    <a href="[Unsubscribe Link]">Unsubscribe</a>
                </p>
            </div>
        </div>
    );
};

export default Template1;
