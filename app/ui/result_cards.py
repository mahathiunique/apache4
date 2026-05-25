from nicegui import ui
from app.utils.formatter import convert_hours


def result_cards(
        mortality,
        survival,
        los
):

    with ui.row().classes(
        "w-full gap-5 mt-8"
    ):

        with ui.card().classes(
            "w-72 p-6 rounded-3xl"
        ):

            ui.label(
                "Mortality Risk"
            ).classes(
                "text-red-500 font-bold"
            )

            ui.label(
                f"{mortality}%"
            ).classes(
                "text-5xl font-bold text-red-500"
            )

        with ui.card().classes(
            "w-72 p-6 rounded-3xl"
        ):

            ui.label(
                "Survival Probability"
            ).classes(
                "text-green-500 font-bold"
            )

            ui.label(
                f"{survival}%"
            ).classes(
                "text-5xl font-bold text-green-500"
            )

        with ui.card().classes(
            "w-72 p-6 rounded-3xl"
        ):

            ui.label(
                "Estimated ICU Stay"
            ).classes(
                "text-blue-500 font-bold"
            )

            ui.label(
                f"{los} Hours"
            ).classes(
                "text-5xl font-bold text-blue-500"
            )

            ui.label(
                convert_hours(los)
            )