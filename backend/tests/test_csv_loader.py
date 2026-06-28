import pytest

from csv_loader import read_product, scan_tree


@pytest.fixture
def data_dir(tmp_path):
    # 4列ファイル（インバーター）— OL / oL は大小区別の別アラーム
    inv = tmp_path / "三菱" / "インバーター"
    inv.mkdir(parents=True)
    (inv / "A800.csv").write_text(
        "エラーコード,エラー内容,異常内容,処置\n"
        "E.OC1,加速中過電流遮断,加速中に過電流,加速時間を長くする\n"
        "OL,ストール防止(過電流),電流を制限中,負荷を軽くする\n"
        "oL,ストール防止(過電圧),減速を中断中,減速時間を長くする\n",
        encoding="utf-8",
    )
    # 3列ファイル（サーボアンプ）— 異常内容なし / コード 61 が重複
    servo = tmp_path / "三菱" / "サーボアンプ"
    servo.mkdir(parents=True)
    (servo / "J4.csv").write_text(
        "エラーコード,エラー内容,処置\n"
        "61,オペレーションエラー,ポイントテーブル見直し\n"
        "61,過電流(MR-CV),電源設備の点検\n",
        encoding="utf-8",
    )
    # cp932(Shift-JIS) ファイル
    cp = tmp_path / "テスト社" / "機器"
    cp.mkdir(parents=True)
    (cp / "S1.csv").write_bytes(
        "エラーコード,エラー内容,処置\nA1,異常発生,対処する\n".encode("cp932")
    )
    # CSV を含まない空カテゴリ（無視されるべき）
    (tmp_path / "三菱" / "空カテゴリ").mkdir(parents=True)
    return tmp_path


def test_scan_tree_structure(data_dir):
    tree = scan_tree(data_dir)
    makers = {m["name"] for m in tree}
    assert {"三菱", "テスト社"} <= makers

    mitsubishi = next(m for m in tree if m["name"] == "三菱")
    cats = {c["name"] for c in mitsubishi["categories"]}
    assert cats == {"インバーター", "サーボアンプ"}  # 空カテゴリは除外

    inv = next(c for c in mitsubishi["categories"] if c["name"] == "インバーター")
    assert inv["products"] == ["A800"]


def test_scan_tree_missing_dir_returns_empty(tmp_path):
    assert scan_tree(tmp_path / "does-not-exist") == []


def test_read_4col(data_dir):
    result = read_product(data_dir, "三菱", "インバーター", "A800")
    assert result["columns"] == ["エラーコード", "エラー内容", "異常内容", "処置"]
    assert len(result["rows"]) == 3


def test_read_3col(data_dir):
    result = read_product(data_dir, "三菱", "サーボアンプ", "J4")
    assert result["columns"] == ["エラーコード", "エラー内容", "処置"]


def test_duplicate_codes_preserved(data_dir):
    result = read_product(data_dir, "三菱", "サーボアンプ", "J4")
    codes = [row[0] for row in result["rows"]]
    assert codes.count("61") == 2


def test_case_sensitive_codes(data_dir):
    result = read_product(data_dir, "三菱", "インバーター", "A800")
    codes = [row[0] for row in result["rows"]]
    assert "OL" in codes and "oL" in codes


def test_cp932_fallback(data_dir):
    result = read_product(data_dir, "テスト社", "機器", "S1")
    assert result["columns"][0] == "エラーコード"
    assert result["rows"][0] == ["A1", "異常発生", "対処する"]


def test_read_missing_file_raises(data_dir):
    with pytest.raises(FileNotFoundError):
        read_product(data_dir, "三菱", "インバーター", "存在しない")


def test_read_traversal_raises(data_dir):
    with pytest.raises(ValueError):
        read_product(data_dir, "..", "x", "y")
