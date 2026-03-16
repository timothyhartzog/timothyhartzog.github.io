import marimo

__generated_with = "0.10.0"
app = marimo.App(width="medium")


@app.cell
def _(mo):
    mo.md(
        """
        # Sample Data Analysis

        This is a Marimo notebook demonstrating interactive analysis.
        Edit this notebook in VS Code or run `marimo edit notebooks/sample-analysis.py`.
        """
    )
    return


@app.cell
def _():
    import marimo as mo
    import plotly.express as px
    import plotly.io as pio
    import pandas as pd
    import numpy as np
    return mo, np, pd, pio, px


@app.cell
def _(np, pd):
    # Generate sample data
    months = pd.date_range("2025-01", periods=12, freq="ME")
    df = pd.DataFrame(
        {
            "month": months.strftime("%b %Y"),
            "revenue": np.cumsum(np.random.normal(50000, 10000, 12)) + 200000,
            "users": np.cumsum(np.random.normal(500, 100, 12)) + 5000,
            "churn_rate": np.clip(np.random.normal(3, 0.5, 12), 1, 5),
        }
    )
    df
    return (df,)


@app.cell
def _(df, px):
    # Interactive revenue chart
    fig_revenue = px.line(
        df,
        x="month",
        y="revenue",
        title="Monthly Revenue Trend",
        markers=True,
    )
    fig_revenue.update_layout(
        template="plotly_dark",
        xaxis_title="",
        yaxis_title="Revenue ($)",
    )
    fig_revenue
    return (fig_revenue,)


@app.cell
def _(df, px):
    # Users vs churn scatter
    fig_scatter = px.scatter(
        df,
        x="users",
        y="churn_rate",
        size="revenue",
        color="month",
        title="Users vs Churn Rate",
    )
    fig_scatter.update_layout(template="plotly_dark")
    fig_scatter
    return (fig_scatter,)


@app.cell
def _(df, fig_revenue, fig_scatter, mo, pio):
    # Export charts as JSON for embedding in the Astro site
    import json
    from pathlib import Path

    export_dir = Path("public/data/charts")
    export_dir.mkdir(parents=True, exist_ok=True)

    pio.write_json(fig_revenue, str(export_dir / "sample-revenue.json"))
    pio.write_json(fig_scatter, str(export_dir / "sample-scatter.json"))

    # Also export the data as CSV for the data directory
    data_dir = Path("src/data")
    df.to_csv(str(data_dir / "sample-monthly.csv"), index=False)

    mo.md(
        f"""
        **Exported:**
        - `{export_dir}/sample-revenue.json`
        - `{export_dir}/sample-scatter.json`
        - `{data_dir}/sample-monthly.csv`

        Use in MDX:
        ```mdx
        <PlotlyChart client:load src="/data/charts/sample-revenue.json" title="Revenue" />
        ```
        """
    )
    return


if __name__ == "__main__":
    app.run()
