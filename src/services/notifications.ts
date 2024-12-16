import { Client, Lawyer } from '../types';

const TWILIO_ENDPOINT = '/api/send-notification';

export const sendClientNotification = async (client: Client, lawyer: Lawyer) => {
  try {
    await fetch(TWILIO_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: client.phoneNumber,
        message: `A lawyer is now available in your area! ${lawyer.fullName} specializes in immigration law.`
      })
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};