import React, { useState } from "react";
import { saveConfig } from "../api/client";

interface SettingsPanelProps {
  currentDir: string;
  onSaved: () => void;
  onCancel?: () => void;
  isSetup?: boolean;
}

export function SettingsPanel({
  currentDir,
  onSaved,
  onCancel,
  isSetup = false,
}: SettingsPanelProps): React.ReactElement {
  const [value, setValue] = useState(currentDir);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const dir = value.trim();
    if (!dir) {
      setError("フォルダのパスを入力してください。");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveConfig(dir);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "var(--space-xxl) var(--space-xl)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "32px",
          fontWeight: 400,
          letterSpacing: "-0.4px",
          color: "var(--color-ink)",
          marginBottom: "var(--space-lg)",
        }}
      >
        {isSetup ? "データフォルダを設定してください" : "データフォルダの変更"}
      </h1>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "15px",
          color: "var(--color-body)",
          lineHeight: 1.55,
          marginBottom: "var(--space-xl)",
        }}
      >
        エラーコードCSVが入っているルートフォルダを指定してください。
        <br />
        フォルダ構成: <code style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--color-primary)" }}>メーカー / カテゴリ / 製品名.csv</code>
      </p>

      <div style={{ marginBottom: "var(--space-lg)" }}>
        <label
          htmlFor="data-dir-input"
          style={{
            display: "block",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--color-muted)",
            marginBottom: "var(--space-xs)",
          }}
        >
          フォルダのパス
        </label>
        <input
          id="data-dir-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={String.raw`例: C:\Users\barub\Document\エラーコード`}
          style={{
            width: "100%",
            height: "44px",
            padding: "0 var(--space-md)",
            borderRadius: "var(--rounded-md)",
            border: `1px solid ${error ? "var(--color-error)" : "var(--color-hairline)"}`,
            background: "var(--color-canvas)",
            color: "var(--color-ink)",
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
            outline: "none",
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = "var(--color-primary)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,120,92,0.15)";
          }}
          onBlur={(e) => {
            if (!error) e.currentTarget.style.borderColor = "var(--color-hairline)";
            e.currentTarget.style.boxShadow = "none";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
        {error && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "var(--color-error)",
              marginTop: "var(--space-xs)",
            }}
          >
            {error}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "var(--space-sm)" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "12px 24px",
            borderRadius: "var(--rounded-md)",
            background: saving ? "var(--color-primary-disabled)" : "var(--color-primary)",
            color: "var(--color-on-primary)",
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            fontWeight: 500,
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "保存中…" : "保存して適用"}
        </button>

        {!isSetup && onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: "12px 24px",
              borderRadius: "var(--rounded-md)",
              background: "var(--color-canvas)",
              color: "var(--color-ink)",
              border: "1px solid var(--color-hairline)",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            キャンセル
          </button>
        )}
      </div>
    </div>
  );
}
