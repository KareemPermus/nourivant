def total_calories(recipe):
    return sum(item["calories"] for item in recipe["ingredients"])
