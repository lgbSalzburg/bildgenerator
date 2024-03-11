import json
import fileinput
import re

logos = []
for line in fileinput.input():
    cleanup_line = re.sub('[-_][Gg]ruene[-_][Ll]ogo[-_][Ww]eiss', '', line).rstrip().replace('-', ' ').replace('gruene', 'grüne')
    name = re.sub('\.[a-z]+$','', cleanup_line)
    logos.append({'name': name.title(), 'file': line.rstrip()})
print(json.dumps(logos))
