import calendar
import datetime


def safe_int(val: str | None) -> int | None:
    if not val:
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None


def get_period_ranges(mes: str | None, anio: str | None) -> tuple:
    hoy = datetime.datetime.now(tz=datetime.timezone.utc).date()

    parsed_anio = safe_int(anio)
    anio_actual = parsed_anio if (parsed_anio and 1900 <= parsed_anio <= 2100) else hoy.year

    parsed_mes = safe_int(mes)
    mes_actual = parsed_mes if (parsed_mes and 1 <= parsed_mes <= 12) else hoy.month

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
    parsed_anio = safe_int(anio)
    if not parsed_anio or parsed_anio < 1900 or parsed_anio > 2100:
        return None, None

    parsed_mes = safe_int(mes)
    if parsed_mes and 1 <= parsed_mes <= 12:
        inicio = datetime.date(parsed_anio, parsed_mes, 1)
        _, ultimo_dia = calendar.monthrange(parsed_anio, parsed_mes)
        fin = datetime.date(parsed_anio, parsed_mes, ultimo_dia)
    else:
        inicio = datetime.date(parsed_anio, 1, 1)
        fin = datetime.date(parsed_anio, 12, 31)

    return inicio, fin
