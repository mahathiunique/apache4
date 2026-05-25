from nicegui import ui

from app.ui.sidebar import create_sidebar
from app.ui.navbar import create_navbar
from app.ui.prediction_form import prediction_form
from app.ui.result_cards import result_cards
from app.ui.charts import (
    mortality_chart,
    survival_chart
)

from app.services.mortality_service import predict_mortality
from app.services.los_service import predict_los


def create_dashboard():

    with ui.row().classes(
        "w-full no-wrap"
    ):

        create_sidebar()

        with ui.column().classes(
            "w-full"
        ):

            create_navbar()

            with ui.column().classes(
                "p-8 w-full"
            ):

                ui.label(
                    "ICU AI Decision Support System"
                ).classes(
                    "text-5xl font-bold text-blue-900"
                )

                ui.label(
                    "AI-powered Mortality + LOS Prediction"
                ).classes(
                    "text-xl text-gray-500 mb-8"
                )

                form = prediction_form()

                results = ui.column()

                def predict():

                    results.clear()

                    data = [

                        float(form["age"].value),
                        float(form["heart_rate"].value),
                        float(form["map"].value),
                        float(form["fio2"].value),
                        float(form["creatinine"].value),
                        float(form["apache"].value),
                        float(form["aps"].value),
                        float(form["albumin"].value)

                    ]

                    mortality = predict_mortality(data)

                    survival = round(
                        100 - mortality,
                        2
                    )

                    los_days = predict_los(data)

                    los_hours = int(
                        los_days * 24
                    )

                    with results:

                        result_cards(
                            mortality,
                            survival,
                            los_hours
                        )

                        with ui.row().classes(
                            "w-full gap-5 mt-8"
                        ):

                            with ui.card().classes(
                                "w-1/2 p-5"
                            ):

                                mortality_chart(
                                    mortality
                                )

                            with ui.card().classes(
                                "w-1/2 p-5"
                            ):

                                survival_chart(
                                    survival,
                                    mortality
                                )

                ui.button(
                    "Generate AI Prediction",
                    on_click=predict
                ).classes(
                    """
                    mt-8 bg-blue-900
                    text-white px-10 py-4
                    text-xl rounded-2xl
                    """
                )