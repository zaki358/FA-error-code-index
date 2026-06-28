import React, { useEffect, useState } from "react";
import { CategoryTabs } from "./components/CategoryTabs";
import { EmptyState } from "./components/EmptyState";
import { ManufacturerTabs } from "./components/ManufacturerTabs";
import { ProductSelector } from "./components/ProductSelector";
import { ResultList } from "./components/ResultList";
import { SearchInput } from "./components/SearchInput";
import { SettingsPanel } from "./components/SettingsPanel";
import { TopBar } from "./components/TopBar";
import { useErrorSearch } from "./hooks/useErrorSearch";
import { useTree } from "./hooks/useTree";

function getInitialTheme(): "light" | "dark" {
  const saved = localStorage.getItem("ecv-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function App(): React.ReactElement {
  const { manufacturers, dataDir, loading: treeLoading, error: treeError, reload } = useTree();

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ecv-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const [showSettings, setShowSettings] = useState(false);
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [query, setQuery] = useState("");

  // 初回: データフォルダが未設定 or ツリーが空ならセットアップ画面
  const needsSetup =
    !treeLoading &&
    !treeError &&
    manufacturers.length === 0 &&
    !showSettings;

  // メーカー変更時にカテゴリ/製品/クエリをリセット
  const handleSelectMaker = (name: string) => {
    setSelectedMaker(name);
    setSelectedCategory("");
    setSelectedProduct("");
    setQuery("");
  };

  // カテゴリ変更時に製品/クエリをリセット
  const handleSelectCategory = (name: string) => {
    setSelectedCategory(name);
    setSelectedProduct("");
    setQuery("");
  };

  // 製品変更時にクエリをリセット
  const handleSelectProduct = (name: string) => {
    setSelectedProduct(name);
    setQuery("");
  };

  // ツリーが読み込まれたら最初のメーカー/カテゴリを自動選択
  useEffect(() => {
    if (manufacturers.length > 0 && !selectedMaker) {
      const firstMaker = manufacturers[0];
      setSelectedMaker(firstMaker.name);
      if (firstMaker.categories.length > 0) {
        setSelectedCategory(firstMaker.categories[0].name);
      }
    }
  }, [manufacturers, selectedMaker]);

  const currentMaker = manufacturers.find((m) => m.name === selectedMaker);
  const currentCategory = currentMaker?.categories.find((c) => c.name === selectedCategory);
  const products = currentCategory?.products ?? [];

  const { columns, results, loading: errLoading, error: errError } = useErrorSearch(
    selectedMaker,
    selectedCategory,
    selectedProduct,
    query
  );

  const handleSettingsSaved = () => {
    setShowSettings(false);
    setSelectedMaker("");
    setSelectedCategory("");
    setSelectedProduct("");
    setQuery("");
    reload();
  };

  if (treeLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p style={{ fontFamily: "var(--font-sans)", color: "var(--color-muted)" }}>読み込み中…</p>
      </div>
    );
  }

  if (needsSetup || showSettings) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-canvas)" }}>
        <TopBar dataDir={dataDir} onChangeFolder={() => setShowSettings(true)} theme={theme} onToggleTheme={toggleTheme} />
        <SettingsPanel
          currentDir={dataDir}
          onSaved={handleSettingsSaved}
          onCancel={showSettings && !needsSetup ? () => setShowSettings(false) : undefined}
          isSetup={needsSetup}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-canvas)" }}>
      <TopBar dataDir={dataDir} onChangeFolder={() => setShowSettings(true)} theme={theme} onToggleTheme={toggleTheme} />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "var(--space-xl) var(--space-xl)",
        }}
      >
        {/* 選択エリア */}
        <section
          style={{
            background: "var(--color-surface-soft)",
            borderRadius: "var(--rounded-lg)",
            padding: "var(--space-lg) var(--space-xl)",
            marginBottom: "var(--space-xl)",
          }}
        >
          {/* メーカー */}
          <div style={{ marginBottom: "var(--space-sm)" }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--color-muted)",
              }}
            >
              メーカー
            </span>
            <ManufacturerTabs
              manufacturers={manufacturers}
              selected={selectedMaker}
              onSelect={handleSelectMaker}
            />
          </div>

          {/* カテゴリ */}
          {currentMaker && currentMaker.categories.length > 0 && (
            <div
              style={{
                borderTop: "1px solid var(--color-hairline-soft)",
                paddingTop: "var(--space-sm)",
                marginBottom: "var(--space-sm)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}
              >
                カテゴリ
              </span>
              <CategoryTabs
                categories={currentMaker.categories}
                selected={selectedCategory}
                onSelect={handleSelectCategory}
              />
            </div>
          )}

          {/* 製品 */}
          {products.length > 0 && (
            <div
              style={{
                borderTop: "1px solid var(--color-hairline-soft)",
                paddingTop: "var(--space-sm)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}
              >
                製品
              </span>
              <ProductSelector
                products={products}
                selected={selectedProduct}
                onSelect={handleSelectProduct}
              />
            </div>
          )}
        </section>

        {/* 検索ボックス */}
        {selectedProduct && (
          <div style={{ marginBottom: "var(--space-xl)" }}>
            <SearchInput
              value={query}
              onChange={setQuery}
              autoFocus={true}
              disabled={errLoading}
            />
          </div>
        )}

        {/* 結果 */}
        {!selectedProduct ? (
          <EmptyState
            message="製品を選択してください"
            sub="上のタブでメーカー → カテゴリ → 製品を選ぶと検索できます"
          />
        ) : (
          <ResultList
            columns={columns}
            results={results}
            query={query}
            loading={errLoading}
            error={errError}
          />
        )}
      </main>
    </div>
  );
}
