def convert_hours(hours):

    days = int(hours // 24)

    remaining = int(hours % 24)

    return f"{days} Days {remaining} Hours"