#!/usr/bin/env python3
"""Test server endpoints and display status."""

import requests
import json

print('\n' + '='*70)
print('🌐 SERVER STATUS CHECK')
print('='*70)

# Test endpoints
endpoints = [
    ('http://127.0.0.1:5000/', 'Home'),
    ('http://127.0.0.1:5000/health', 'Health'),
]

all_ok = True
for url, name in endpoints:
    try:
        response = requests.get(url, timeout=5)
        status = '✅' if response.status_code == 200 else '⚠️'
        print(f'\n{status} {name} Endpoint')
        print(f'   URI: {url}')
        print(f'   Status Code: {response.status_code}')
        
        if response.status_code == 200:
            data = response.json()
            for key, value in data.items():
                if key not in ['authentication', 'endpoints', 'example']:
                    print(f'   {key}: {value}')
    except Exception as e:
        print(f'\n❌ {name} Endpoint')
        print(f'   Error: {str(e)}')
        all_ok = False

print('\n' + '='*70)
if all_ok:
    print('✅ SERVER IS ONLINE AND RESPONDING')
else:
    print('❌ SERVER IS OFFLINE OR NOT RESPONDING')
print('='*70)

print('\n📝 API ENDPOINTS AVAILABLE:')
print('''
GET  http://localhost:5000/             Home page with API docs
GET  http://localhost:5000/health       Health check endpoint
POST http://localhost:5000/generate     Generate content

PORT: 5000 (default Flask port)
HOST: localhost, 127.0.0.1, or 192.168.31.157 (network)
''')
