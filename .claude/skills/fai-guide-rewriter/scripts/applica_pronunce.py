"""Applica le pronunce di pronunce.json a uno script podcast prima di generarlo.

Uso: python3 applica_pronunce.py script.md testo-per-la-voce.txt [--elenco]
Con --elenco stampa le parole sostituite (utile per la scheda di pronuncia).
"""
import json, re, sys, os
diz = json.load(open(os.path.join(os.path.dirname(__file__), 'pronunce.json'), encoding='utf-8'))
diz.pop('_nota', None)
testo = open(sys.argv[1], encoding='utf-8').read()
usate = {}
for parola in sorted(diz, key=len, reverse=True):
    pat = r'(?<![\wÀ-ÿ])' + re.escape(parola) + r'(?![\wÀ-ÿ])'
    testo, n = re.subn(pat, diz[parola], testo)
    if n: usate[parola] = n
open(sys.argv[2], 'w', encoding='utf-8').write(testo)
if '--elenco' in sys.argv:
    for p, n in usate.items(): print(f'{p} -> {diz[p]} ({n})')
