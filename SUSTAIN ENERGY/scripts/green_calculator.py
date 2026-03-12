"""
Simple rubric calculator (placeholder for the project skeleton).
Levels: 0 = not started, 1 = basic, 2 = solid, 3 = leading
"""

def level_to_points(level):
    if level < 0:
        return 0
    if level > 3:
        level = 3
    return level * 5


def score(selections):
    return sum(level_to_points(level) for level in selections)


if __name__ == "__main__":
    sample = [3, 2, 2, 1, 1, 2, 3, 2]
    total = score(sample)
    print("Sample total points:", total)
