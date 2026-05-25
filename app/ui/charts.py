from nicegui import ui
import plotly.graph_objects as go


def mortality_chart(value):

    fig = go.Figure(go.Indicator(

        mode="gauge+number",

        value=value,

        title={'text': "Mortality Risk %"},

        gauge={

            'axis': {'range': [0, 100]},

            'bar': {'color': "red"},

            'steps': [

                {'range': [0, 30], 'color': "#22c55e"},
                {'range': [30, 70], 'color': "#facc15"},
                {'range': [70, 100], 'color': "#ef4444"},

            ],
        }
    ))

    fig.update_layout(height=350)

    ui.plotly(fig)


def survival_chart(survival, mortality):

    fig = go.Figure(

        data=[

            go.Pie(
                labels=["Survival", "Mortality"],
                values=[survival, mortality],
                hole=.6
            )

        ]
    )

    fig.update_layout(height=350)

    ui.plotly(fig)