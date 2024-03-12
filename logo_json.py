import json
import fileinput
import re
import sys

logos = []
for line in fileinput.input():
    cleanup_line = re.sub('([-_][Gg]ruene)?[-_][Ll]ogo[-_][Ww]eiss(_\d{3}_\d{3})?', '', line).rstrip().replace('-', ' ').replace('gruene', 'grüne')
    name = re.sub('\.[a-z]+$','', cleanup_line)
    logos.append({'name': name.title(), 'file': line.rstrip()})

names = [l['name'] for l in logos]
if len(names) != len(set(names)):
    print("Duplicate Names", file=sys.stderr)
    print(sorted(names), file=sys.stderr)
    print(sorted(set(names)), file=sys.stderr)
    sys.exit(1)
else: 
    print(json.dumps(logos))
