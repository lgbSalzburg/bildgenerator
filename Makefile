server:
	python -m http.server 8000

logo-json:
	ls resources/images/logos/gemeinden | sort | python3 logo_json.py > resources/images/logos/index/gemeinde-logos.json