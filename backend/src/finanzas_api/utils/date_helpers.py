import calendar
import datetime


def get_period_ranges(mes: str | None, anio: str | None) -> tuple:
    hoy = datetime.datetime.now(tz=datetime.timezone.utc).date()
    anio_actual = int(anio) if anio else hoy.year
    mes_actual = int(mes) if mes else hoy.month

    curr_start = datetime.date(anio_actual, mes_actual, 1)
    _, ultimo_dia = calendar.monthrange(anio_actual, mes_actual)
    curr_end = datetime.date(anio_actual, mes_actual, ultimo_dia)

    mes_previo = mes_actual - 1 if mes_actual > 1 else 12
    anio_previo = anio_actual if mes_actual > 1 else anio_actual - 1
    prev_start = datetime.date(anio_previo, mes_previo, 1)
    _, ultimo_dia_prev = calendar.monthrange(anio_previo, mes_previo)
    prev_end = datetime.date(anio_previo, mes_previo, ultimo_dia_prev)

    return (curr_start, curr_end), (prev_start, prev_end)


def build_filter_dates(anio: str | None, mes: str | None):
    if not anio:
        return None, None

    anio_int = int(anio)
    if mes:
        mes_int = int(mes)
        inicio = datetime.date(anio_int, mes_int, 1)
        _, ultimo_dia = calendar.monthrange(anio_int, mes_int)
        fin = datetime.date(anio_int, mes_int, ultimo_dia)
    else:
        inicio = datetime.date(anio_int, 1, 1)
        fin = datetime.date(anio_int, 12, 31)

    return inicio, fin
