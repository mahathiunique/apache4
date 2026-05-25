from nicegui import ui


def create_sidebar():

    with ui.column().classes(
        """
        w-72 h-screen
        bg-white shadow-lg
        p-5
        """
    ):

        ui.label(
            "Navigation"
        ).classes(
            "text-gray-500 text-xl mb-5"
        )

        menus = [

            "Dashboard",
            "Mortality Prediction",
            "LOS Prediction",
            "Explainability",
            "ICU Monitoring",
            "Patients",
            "Reports",
            "Analytics",
            "Settings"

        ]

        for menu in menus:

            ui.button(menu).classes(
                """
                w-full mb-3
                bg-white text-blue-900
                shadow-none text-left
                """
            )