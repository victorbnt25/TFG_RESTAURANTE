
import json

url = "http://localhost:5000/chat"
payload = {"message": "Dime qué platos tenéis en la carta"}

try:
    response = httpx.post(url, json=payload, timeout=30.0)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
except Exception as e:
    print(f"Error: {e}")
