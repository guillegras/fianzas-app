def transaction_payload(
    *,
    amount="10.50",
    transaction_type="gasto_variable",
    transaction_date="2026-09-02",
    category="Ocio",
):
    return {
        "titulo": category,
        "monto": amount,
        "tipo": transaction_type,
        "categoria": category,
        "fecha": transaction_date,
        "descripcion": "Movimiento de prueba",
    }


def test_health_does_not_require_database(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readiness_reports_database_access(client):
    response = client.get("/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ready"}


def test_create_transaction_returns_decimal_amount(client):
    response = client.post("/transacciones/", json=transaction_payload(amount="12.34"))

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == 1
    assert body["monto"] == "12.34"
    assert body["tipo"] == "gasto_variable"


def test_create_rejects_invalid_amount_and_type(client):
    negative_response = client.post(
        "/transacciones/", json=transaction_payload(amount="0")
    )
    invalid_type_response = client.post(
        "/transacciones/",
        json=transaction_payload(transaction_type="transferencia"),
    )

    assert negative_response.status_code == 422
    assert invalid_type_response.status_code == 422


def test_create_rejects_more_than_two_decimal_places(client):
    response = client.post(
        "/transacciones/", json=transaction_payload(amount="10.999")
    )

    assert response.status_code == 422


def test_create_rejects_fields_over_maximum_length(client):
    response = client.post(
        "/transacciones/",
        json=transaction_payload(category="x" * 81),
    )

    assert response.status_code == 422


def test_list_orders_by_date_and_id_and_supports_pagination(client):
    first = client.post(
        "/transacciones/", json=transaction_payload(transaction_date="2026-09-02")
    ).json()
    second = client.post(
        "/transacciones/", json=transaction_payload(transaction_date="2026-09-02")
    ).json()
    older = client.post(
        "/transacciones/", json=transaction_payload(transaction_date="2026-09-01")
    ).json()

    page = client.get("/transacciones/?limit=2&offset=0")
    next_page = client.get("/transacciones/?limit=2&offset=2")

    assert page.status_code == 200
    assert [item["id"] for item in page.json()] == [second["id"], first["id"]]
    assert page.headers["x-page-limit"] == "2"
    assert page.headers["x-page-offset"] == "0"
    assert [item["id"] for item in next_page.json()] == [older["id"]]


def test_pagination_rejects_limit_above_one_hundred(client):
    response = client.get("/transacciones/?limit=101")

    assert response.status_code == 422


def test_delete_transaction_and_missing_transaction(client):
    created = client.post("/transacciones/", json=transaction_payload()).json()

    deleted = client.delete(f"/transacciones/{created['id']}")
    missing = client.delete(f"/transacciones/{created['id']}")
    listing = client.get("/transacciones/")

    assert deleted.status_code == 204
    assert deleted.content == b""
    assert missing.status_code == 404
    assert listing.json() == []


def test_defaults_are_applied_when_optional_fields_are_omitted(client):
    response = client.post(
        "/transacciones/",
        json={
            "monto": "5.00",
            "tipo": "ingreso",
            "fecha": "2026-09-02",
        },
    )

    assert response.status_code == 200
    assert response.json()["titulo"] == "Movimiento"
    assert response.json()["categoria"] == "General"


def test_very_large_offset_returns_empty_list(client):
    response = client.get("/transacciones/?limit=100&offset=1000")

    assert response.status_code == 200
    assert response.json() == []
