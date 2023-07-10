def print_pascal_triangle(n):
    triangle = []

    for i in range(n):
        row = []
        for j in range(i + 1):
            if j == 0 or j == i:
                # The first and last element of each row is always 1
                row.append(1)
            else:
                # Other elements are the sum of the two elements directly above
                row.append(triangle[i - 1][j - 1] + triangle[i - 1][j])
        triangle.append(row)

    for row in triangle:
        print(" ".join(map(str, row)))

# Example usage
print_pascal_triangle(15)
