import sys, subprocess, numpy as np
src, dst, maxp = sys.argv[1], sys.argv[2], float(sys.argv[3])
SR = 44100
a = np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',src,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout, dtype=np.float32)
fr = int(SR*0.02); n = len(a)//fr
rms = np.sqrt((a[:n*fr].reshape(n,fr)**2).mean(1)); sil = rms < 10**(-40/20)
keep = []; i = 0; cut = 0.0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]: j += 1
        L = (j-i)*fr; M = int(maxp*SR)
        if L > M:
            h = M//2; keep.append(a[i*fr:i*fr+h]); keep.append(a[j*fr-(M-h):j*fr]); cut += (L-M)/SR
        else: keep.append(a[i*fr:j*fr])
        i = j
    else:
        j = i
        while j < n and not sil[j]: j += 1
        keep.append(a[i*fr:j*fr]); i = j
keep.append(a[n*fr:])
out = np.concatenate(keep)
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-',dst],input=out.tobytes(),check=True)
print(f'tagliati {cut:.1f} s')
