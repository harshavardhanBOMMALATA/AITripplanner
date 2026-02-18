
apikey="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"



import re
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from django.shortcuts import render


client = OpenAI(
    api_key=apikey,
    base_url="https://api.groq.com/openai/v1"
)



def home(request):
    return render(request, 'tripplanner.html')

















@csrf_exempt
def trip_plan_generator(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        body = json.loads(request.body)

        starting_location = body.get("starting_location", "").strip()
        days = int(body.get("days", 0))
        min_budget = body.get("min_budget")
        max_budget = body.get("max_budget")
        places = body.get("places", "").strip()
        stay_type = body.get("stay_type", "").strip()
        restaurant_type = body.get("restaurant_type", "").strip()
        preferences = body.get("preferences", "").strip()
        people_count = int(body.get("people_count", 1))

        if not all([starting_location, days, min_budget, max_budget, places, people_count]):
            return JsonResponse({"error": "Missing required fields"}, status=400)

        prompt = f"""
Create a structured travel plan in STRICT JSON format.

Trip Details:
- Starting Location: {starting_location}
- Duration: {days} days
- People Count: {people_count}
- Budget Range: {min_budget}-{max_budget} dollars
- Places: {places}
- Stay Type: {stay_type}
- Restaurant Type: {restaurant_type}
- Preferences: {preferences}

JSON STRUCTURE REQUIRED:

{{
  "travel_overview": {{
      "from": "",
      "initial_travel_mode": "",
      "initial_travel_time": "",
      "estimated_travel_cost": ""
  }},
  "days": {{
      "Day 1": {{
          "city": "",
          "intercity_travel": {{
              "from": "",
              "to": "",
              "mode": "",
              "duration": "",
              "cost": ""
          }},
          "morning": {{
              "time": "",
              "activities": [
                  {{
                      "name": "",
                      "description": ""
                  }}
              ]
          }},
          "afternoon": {{
              "time": "",
              "activities": [
                  {{
                      "name": "",
                      "description": ""
                  }}
              ]
          }},
          "evening": {{
              "time": "",
              "activities": [
                  {{
                      "name": "",
                      "description": ""
                  }}
              ]
          }},
          "local_transport": {{
              "mode": "",
              "estimated_cost": ""
          }},
          "hotels": [
              {{
                  "name": "",
                  "booking_link": "",
                  "cost_per_night": "",
                  "rating": ""
              }}
          ],
          "restaurants": [
              {{
                  "name": "",
                  "map_link": "",
                  "average_cost": "",
                  "rating": ""
              }}
          ],
          "cost_breakdown": {{
              "stay": "",
              "food": "",
              "transport": "",
              "activities": "",
              "total_per_day": ""
          }}
      }}
  }},
  "summary": {{
      "total_estimated_trip_cost": "",
      "budget_suitability_comment": "",
      "money_saving_tips": [],
      "safety_tips": []
  }}
}}

STRICT RULES:
- Generate exactly {days} Day objects.
- Activities must be objects with name and description.
- money_saving_tips and safety_tips must be arrays of plain strings.
- booking_link must be a real hotel website or booking.com link.
- map_link must be a valid Google Maps URL.
- Do NOT use example.com.
- Do NOT use placeholders.
- Do NOT use markdown.
- Do NOT include explanations.
- JSON must be valid for Python json.loads().
"""


        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You generate strictly valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            max_tokens=4096
        )

        ai_text = response.choices[0].message.content.strip()

        print("AI RAW RESPONSE:\n", ai_text)

        # -------- CLEAN AI RESPONSE --------

        # Remove markdown wrappers if present
        cleaned = re.sub(r"```json|```", "", ai_text).strip()

        # Extract JSON block safely
        json_match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if json_match:
            cleaned = json_match.group(0)

        # Validate JSON
        try:
            parsed_json = json.loads(cleaned)
        except json.JSONDecodeError:
            return JsonResponse(
                {"error": "AI returned invalid or truncated JSON"},
                status=500
            )

        return JsonResponse(parsed_json, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
