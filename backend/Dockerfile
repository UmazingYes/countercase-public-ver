FROM python:3.12-slim

RUN apt-get update && apt-get install -y build-essential g++ make && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY judge /tmp/judge
RUN make -C /tmp/judge && cp /tmp/judge/build/judge /app/judge

COPY backend/alembic.ini ./alembic.ini
COPY backend/app ./app

ENV PYTHONPATH=/app
ENV JUDGE_PATH=/app/judge

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]