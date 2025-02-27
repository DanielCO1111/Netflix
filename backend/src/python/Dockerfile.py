# Use an official Python runtime as a base image
FROM python:3.11

# Set the working directory inside the container
WORKDIR /backend/src/python

# Copy the Python client script into the container
COPY backend/src/python/tcp_c.py .

# Expose the TCP client port (not always required, but useful for debugging)
EXPOSE 12345

# Default command to run the Python client
CMD ["python3", "tcp_c.py", "tcp-server", "12345"]