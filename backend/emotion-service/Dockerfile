FROM python:3.11-slim

WORKDIR /app

# Keep Hugging Face cache inside /app so it is always found at runtime
ENV HF_HOME=/app/hf_cache \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch CPU-only first without keeping pip cache
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --default-timeout=300 --retries 10 \
    torch --index-url https://download.pytorch.org/whl/cpu

# Copy and install remaining requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --default-timeout=300 --retries 5 -r requirements.txt

# Pre-download the Hugging Face model into /app/hf_cache
RUN python -c "from transformers import pipeline; pipeline('text-classification', model='j-hartmann/emotion-english-distilroberta-base')"

# Copy application code
COPY main.py .

EXPOSE 5000
CMD ["sh", "-c", "/usr/local/bin/python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-5000}"]