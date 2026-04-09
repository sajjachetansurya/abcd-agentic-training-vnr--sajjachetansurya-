arr = [10, 25, 30, 45, 60]
target = 28

closest = min(arr, key=lambda x: abs(x-target))

print("Closest value:", closest)