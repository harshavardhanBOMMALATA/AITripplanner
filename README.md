# 🌍 AITripplanner

## Introduction

AI Trip Planner is a simple yet intelligent web application designed to help travelers create structured, day-wise travel plans based on their preferences, budget, and timeline. Instead of spending hours researching destinations, hotels, transport, and activities separately, users can generate a complete travel itinerary in seconds.

It transforms travel confusion into organized adventure.

## About This Project

This project was created with one simple thought — planning a trip should be exciting, not stressful.

Many people decide to travel to a place but get overwhelmed by questions:
Where should I stay?  
What should I do on Day 1?  
How much will it cost?  
Is my budget enough?  
How do I travel between cities?

Imagine a family planning a 5-day vacation. They open multiple tabs — hotel booking sites, Google Maps, travel blogs, YouTube vlogs, budget calculators — and still feel uncertain about their final plan.

AI Trip Planner solves this problem.

Instead of manually researching everything, the user simply enters their starting location, duration, budget range, number of people, destination preferences, stay type, and restaurant preference.

The system then generates a structured travel plan that includes:

- Travel overview  
- Intercity travel details  
- Morning, afternoon, and evening activities  
- Hotel suggestions with booking links  
- Restaurant recommendations with map links  
- Daily cost breakdown  
- Final trip summary with budget analysis  
- Money-saving tips and safety tips  

It gives clarity, structure, and confidence — all in one place.

## Technologies & Implementation

AI Trip Planner is built using Django as the core backend framework. Django handles request processing, validation, AI communication, and structured JSON responses.

The frontend is developed using HTML, CSS, and JavaScript to create a responsive and dynamic travel interface. The UI renders day-wise travel cards, structured activity sections, cost breakdown panels, and summary sections in an organized layout.

The intelligence of the platform is powered by Groq AI (LLaMA model). When a user submits their trip details, the backend constructs a strict JSON-based prompt and sends it to the AI model. The AI returns a structured, multi-day travel plan in JSON format, which is validated and dynamically rendered on the frontend.

Deployment is handled using Render, with Gunicorn as the production server and WhiteNoise for static file management.

The goal was to combine backend engineering, AI intelligence, and practical travel planning into one meaningful tool.

## Folder Structure

AITripplanner/

│  
├── manage.py  
├── requirements.txt  
├── runtime.txt  
├── build.sh  
├── Procfile  

│  
├── static/  
│   ├── styles/  
│   ├── scripts/  
│   └── images/  

│  
├── templates/  
│   └── index.html  

│  
├── AITripplanner/  
│   ├── __init__.py  
│   ├── settings.py  
│   ├── urls.py  
│   ├── views.py  
│   ├── wsgi.py  
│   └── asgi.py  

## Conclusion

AI Trip Planner is more than just a technical project — it is a travel companion powered by artificial intelligence.

Many people love traveling but struggle with organizing their journey efficiently. This tool aims to remove that friction.

A clear plan reduces stress, saves time, and improves travel experience. Instead of searching randomly, users can follow a structured day-wise itinerary tailored to their needs.

The objective is simple — provide clarity in a world full of scattered travel information.

If this project helps even one traveler plan better and travel smarter, then it has achieved its purpose.

## Contact Me

Email: hbommalata@gmail.com  
Instagram: https://www.instagram.com/always_harsha_royal/  
LinkedIn: https://www.linkedin.com/in/harshavardhan-bommalata-7bb9442b0/  
GitHub: https://github.com/harshavardhanBOMMALATA
