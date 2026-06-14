FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install PyTorch CPU-only FIRST (much smaller, ~180MB vs 670MB)
RUN pip install --upgrade pip && \
    pip install --default-timeout=300 --retries 10 \
    torch --index-url https://download.pytorch.org/whl/cpu

# Copy and install remaining requirements
COPY requirements.txt .
RUN pip install --default-timeout=300 --retries 5 -r requirements.txt

# Pre-download the Hugging Face model
RUN python -c "from transformers import pipeline; pipeline('text-classification', model='j-hartmann/emotion-english-distilroberta-base')"

# Copy application code
COPY main.py .

EXPOSE 5000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]