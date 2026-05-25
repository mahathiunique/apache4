from nicegui import ui


def prediction_form():

    with ui.card().classes(
        "w-full p-8 rounded-3xl"
    ):

        ui.label(
            "Patient Clinical Inputs"
        ).classes(
            "text-3xl font-bold mb-5"
        )

        with ui.grid(columns=2).classes(
            "w-full gap-5"
        ):

            age = ui.input("Age", value=83)

            heart_rate = ui.input(
                "Heart Rate",
                value=100
            )

            map_value = ui.input(
                "MAP",
                value=103
            )

            fio2 = ui.input(
                "FiO2",
                value=40
            )

            creatinine = ui.input(
                "Creatinine",
                value=0.8
            )

            apache = ui.input(
                "Apache IV Score",
                value=43
            )

            aps = ui.input(
                "APS Score",
                value=26
            )

            albumin = ui.input(
                "Albumin",
                value=22.5
            )

    return {

        "age": age,
        "heart_rate": heart_rate,
        "map": map_value,
        "fio2": fio2,
        "creatinine": creatinine,
        "apache": apache,
        "aps": aps,
        "albumin": albumin

    }