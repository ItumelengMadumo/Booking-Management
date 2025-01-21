import smtplib
"""
This module provides functionality for booking services and sending confirmation emails.
Functions:
    book_service(service_name, date, time, user_email):
        Books a service and sends a confirmation email to the user.
    send_confirmation_email(booking_details):
        Sends a confirmation email with the booking details.
Example usage:
"""
    """
    Books a service and sends a confirmation email to the user.
    Args:
        service_name (str): The name of the service to be booked.
        date (str): The date of the booking.
        time (str): The time of the booking.
        user_email (str): The email address of the user.
    Returns:
        dict: A dictionary containing the booking details.
    """
    """
    Sends a confirmation email with the booking details.
    Args:
        booking_details (dict): A dictionary containing the booking details.
    """
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import re

service_name = input("Enter the service name: ")
date = input("Enter the date (YYYY-MM-DD): ")
time = input("Enter the time (HH:MM AM/PM): ")
user_email = input("Enter your email address: ")
# Validate and process user inputs
try:
    # Convert date and time to a datetime object to ensure correct format
    booking_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %I:%M %p")
except ValueError as e:
    print(f"Error in date/time format: {e}")
    exit(1)

# Ensure the email format is valid
email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
if not re.match(email_regex, user_email):
    print("Invalid email format")
    exit(1)
def book_service(service_name, date, time, user_email):
    booking_details = {
        'service_name': service_name,
        'date': date,
        'time': time,
        'user_email': user_email
    }
    send_confirmation_email(booking_details)
    return booking_details
    # Log the booking details
    print(f"Booking confirmed: {booking_details}")

def send_confirmation_email(booking_details):
    sender_email = "your_email@example.com"
    receiver_email = booking_details['user_email']
    password = "your_email_password"

    subject = "Booking Confirmation"
    body = f"Dear Customer,\n\nYour booking for {booking_details['service_name']} on {booking_details['date']} at {booking_details['time']} has been confirmed.\n\nThank you for choosing our service.\n\nBest regards,\nYour Company"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.example.com', 587)
        server.starttls()
        server.login(sender_email, password)
        text = msg.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Example usage
if __name__ == "__main__":
    service_name = "Haircut"
    date = "2023-11-01"
    time = "10:00 AM"
    user_email = "customer@example.com"
    booking = book_service(service_name, date, time, user_email)
    print("Booking details:", booking)
    # Example usage for regular guest
    if __name__ == "__main__":
        service_name = "Haircut"
        date = "2023-11-01"
        time = "10:00 AM"
        user_email = "customer@example.com"
        booking = book_service(service_name, date, time, user_email)
        print("Booking details:", booking)

        # Example usage for guest
        guest_service_name = "Massage"
        guest_date = "2023-11-02"
        guest_time = "2:00 PM"
        guest_email = "guest@example.com"
        guest_booking = book_service(guest_service_name, guest_date, guest_time, guest_email)
        print("Guest booking details:", guest_booking)