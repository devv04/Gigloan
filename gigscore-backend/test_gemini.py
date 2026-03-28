import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()
# Using TEST_GEMINI_API_KEY for testing
api_key = os.getenv("TEST_GEMINI_API_KEY")
genai.configure(api_key=api_key)

output = {}

try:
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("hello")
    output["gemini-1.5-flash"] = "SUCCESS"
except Exception as e:
    output["gemini-1.5-flash"] = str(e)

try:
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content("hello")
    output["gemini-2.0-flash"] = "SUCCESS"
except Exception as e:
    output["gemini-2.0-flash"] = str(e)

with open("quota_err.json", "w") as f:
    json.dump(output, f, indent=2)
