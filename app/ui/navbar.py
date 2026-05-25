from nicegui import ui


def create_navbar():

    with ui.row().classes(
        """
        w-full bg-blue-900
        items-center justify-between
        px-8 py-4 text-white
        """
    ):

        ui.label(
            "APACHE IV ICU Intelligence Dashboard"
        ).classes(
            "text-3xl font-bold"
        )

        with ui.row().classes(
            "items-center gap-5"
        ):

            ui.label(
                "Live Monitoring"
            ).classes(
                "text-green-400"
            )

            ui.avatar(
                "D"
            ).classes(
                "bg-blue-500"
            )

            ui.label(
                "Dr. Patel"
            )