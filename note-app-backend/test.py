import requests

data = {
    "title": "Note Title",
    "tags": ["Tag 1", "Tag 2"],
    "body": "Note Body"
}

response = requests.post("http://localhost:5000/notes", json=data)

print("Status code:", response.status_code)
print("Response text:", response.text)

try:
    print("JSON response:", response.json())
except Exception as e:
    print("Failed to parse response as JSON:", e)
