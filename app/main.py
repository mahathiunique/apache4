from nicegui import ui

from app.ui.dashboard import create_dashboard

ui.add_head_html("""

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<style>

body{
    background:#F4F7FB;
    font-family: 'Inter', sans-serif;
}

.nicegui-content{
    padding:0;
    gap:0;
}

</style>

""")

create_dashboard()

ui.run(
    title="Apollo Hospitals ICU AI",
    reload=False
)