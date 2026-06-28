import pytest

from security import is_safe_name, safe_join


def test_is_safe_name_accepts_normal():
    assert is_safe_name("三菱")
    assert is_safe_name("A800")
    assert is_safe_name("A800.csv")
    assert is_safe_name("MR-J4")


@pytest.mark.parametrize("bad", ["", ".", "..", "a/b", "a\\b", "x\x00y"])
def test_is_safe_name_rejects_bad(bad):
    assert not is_safe_name(bad)


def test_safe_join_within(tmp_path):
    (tmp_path / "m" / "c").mkdir(parents=True)
    result = safe_join(tmp_path, "m", "c")
    assert result == (tmp_path / "m" / "c").resolve()


def test_safe_join_rejects_parent_escape(tmp_path):
    with pytest.raises(ValueError):
        safe_join(tmp_path, "..", "secret.txt")


def test_safe_join_rejects_separator(tmp_path):
    with pytest.raises(ValueError):
        safe_join(tmp_path, "a/b", "c")
