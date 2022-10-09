import sys
import os

filename = sys.argv[1]
with open(filename, "r") as fin:
    for line in fin:
        if "All files        |" in line:
            cov = line.split('|')[4].strip()
            print(cov)
            break
