import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
import websockets
import asyncio

# Function to send email
# Find an Api that allows you to send emails
def send_email(recipient_email, subject, body):
    sender_email = "your_email@example.com"
    sender_password = "your_password"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.example.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, recipient_email, text)
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Function to send text message
#find an API that allows you to send text messages
def send_text_message(phone_number, message):
    api_url = "https://api.textmessageprovider.com/send"
    api_key = "your_api_key"
    payload = {
        'phone_number': phone_number,
        'message': message,
        'api_key': api_key
    }

    try:
        response = requests.post(api_url, data=payload)
        if response.status_code == 200:
            print("Text message sent successfully")
        else:
            print(f"Failed to send text message: {response.status_code}")
    except Exception as e:
        print(f"Error sending text message: {e}")


# Example usage
if __name__ == "__main__":
    # Send email
    send_email("recipient@example.com", "Booking Confirmation", "Your booking has been confirmed.")

    # Send text message
    send_text_message("+1234567890", "Your booking has been confirmed.")

   