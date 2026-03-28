import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

models = []
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            models.append(m.name)
    
    with open("available_models.json", "w") as f:
        json.dump(models, f, indent=2)
except Exception as e:
    with open("available_models.json", "w") as f:
        json.dump({"error": str(e)}, f)
