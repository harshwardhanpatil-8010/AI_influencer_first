# Use a specific, slim, and recent Python version for a small and secure base
# Stage 1: Build the application dependencies
FROM python:3.11-slim-bookworm AS builder

# Set working directory
WORKDIR /usr/src/app

# Set environment variables
# - PYTHONDONTWRITEBYTECODE: Prevents Python from writing .pyc files
# - PYTHONUNBUFFERED: Ensures logs are sent straight to stdout
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create and activate a virtual environment for clean dependency management
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install build-time dependencies if any (e.g., for compiling C extensions)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc

# Copy and install Python dependencies first to leverage Docker's layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- 

# Stage 2: Create the final production image
FROM python:3.11-slim-bookworm AS final

# Set working directory
WORKDIR /usr/src/app

# Create a non-root user for security
RUN addgroup --system app && adduser --system --group app

# Copy the virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Copy application code
COPY . .

# Set ownership of the application directory
RUN chown -R app:app /usr/src/app

# Switch to the non-root user
USER app

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Set the virtual environment's Python as the default
ENV PATH="/opt/venv/bin:$PATH"

# Define the command to run the application (replace with your actual command)
# Example for Gunicorn: CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wsgi:app"]
# Example for a simple script: CMD ["python", "app.py"]
CMD ["echo", "Please replace this with your application's start command in the Dockerfile"]