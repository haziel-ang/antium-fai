"""Accorcia i silenzi lunghi di una puntata, lasciando intatti quelli brevi.

Uso: python -I accorcia_pause.py grezzo.mp3 accorciato.wav [max] [fine_intro] [max_intro]
  max         pausa massima nel racconto, in secondi (default 0.8)
  fine_intro  secondi dall'inizio entro cui vale max_intro (default 20)
  max_intro   pausa massima nell'intro e tra l'intro e il racconto (default 1.0)
Scelta dell'utente del 27/11/2026: pause sì, ma senza perdere fluidità.
Serve numpy (sulla VPS: ~/.local/share/wanderlust-allinea/bin/python).
"""
import sys, subprocess
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
maxp = float(sys.argv[3]) if len(sys.argv) > 3 else 0.8
fine_intro = float(sys.argv[4]) if len(sys.argv) > 4 else 20.0
max_intro = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
SR = 44100
a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                                 capture_output=True, check=True).stdout, dtype=np.float32)
fr = int(SR * 0.02); n = len(a) // fr
sil = np.sqrt((a[:n * fr].reshape(n, fr) ** 2).mean(1)) < 10 ** (-40 / 20)
parti, i, tagliato, lunghe = [], 0, 0.0, 0
while i < n:
    j = i
    while j < n and sil[j] == sil[i]:
        j += 1
    pezzo = a[i * fr:j * fr]
    if sil[i]:
        limite = max_intro if i * fr / SR < fine_intro else maxp
        M = int(limite * SR)
        if len(pezzo) > M:
            h = M // 2
            tagliato += (len(pezzo) - M) / SR; lunghe += 1
            pezzo = np.concatenate([pezzo[:h], pezzo[len(pezzo) - (M - h):]])
    parti.append(pezzo); i = j
parti.append(a[n * fr:])
out = np.concatenate(parti)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', dst],
               input=out.tobytes(), check=True)
print(f'pause accorciate: {lunghe}, secondi tolti: {tagliato:.1f}')
