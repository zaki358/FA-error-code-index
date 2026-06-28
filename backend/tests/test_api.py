from fastapi.testclient import TestClient

import main

client = TestClient(main.app)


def _make_tree(root):
    d = root / "M" / "C"
    d.mkdir(parents=True)
    (d / "P.csv").write_text(
        "エラーコード,エラー内容,処置\nX1,内容,対処\nX1,別の内容,別の対処\n",
        encoding="utf-8",
    )
    return root


def test_config_roundtrip(tmp_path):
    _make_tree(tmp_path)
    resp = client.post("/api/config", json={"data_dir": str(tmp_path)})
    assert resp.status_code == 200
    assert resp.json()["data_dir"] == str(tmp_path)

    tree = client.get("/api/tree").json()
    assert tree["data_dir"] == str(tmp_path)
    assert any(m["name"] == "M" for m in tree["manufacturers"])


def test_set_config_rejects_missing_dir(tmp_path):
    resp = client.post("/api/config", json={"data_dir": str(tmp_path / "nope")})
    assert resp.status_code == 422


def test_set_config_rejects_empty():
    resp = client.post("/api/config", json={"data_dir": "   "})
    assert resp.status_code == 422


def test_errors_endpoint(tmp_path):
    _make_tree(tmp_path)
    client.post("/api/config", json={"data_dir": str(tmp_path)})
    resp = client.get(
        "/api/errors",
        params={"manufacturer": "M", "category": "C", "product": "P"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["columns"][0] == "エラーコード"
    # 重複コードが両方返ること
    assert [r[0] for r in body["rows"]] == ["X1", "X1"]


def test_errors_traversal_returns_422(tmp_path):
    client.post("/api/config", json={"data_dir": str(tmp_path)})
    resp = client.get(
        "/api/errors",
        params={"manufacturer": "..", "category": "C", "product": "P"},
    )
    assert resp.status_code == 422


def test_errors_missing_product_returns_404(tmp_path):
    _make_tree(tmp_path)
    client.post("/api/config", json={"data_dir": str(tmp_path)})
    resp = client.get(
        "/api/errors",
        params={"manufacturer": "M", "category": "C", "product": "Nope"},
    )
    assert resp.status_code == 404
