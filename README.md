# 言橋 · 英日語學習

手機優先的英日語學習 App：每日 **20 分鐘**，依程度練習**說、聽、讀、寫**，並追蹤學習目標與進度。

## 功能

- 引導設定：語言（英語／日語）、程度（初／中／高）
- 今日橋段：20 分鐘進度環、連續學習天數
- 聽力練習：播放語音後作答（可選查看原文）
- 說話練習：聽範讀＋麥克風發音比對（Web Speech API）
- 每題附中文說明與文法解釋
- 學習目標：自訂天數與聚焦技能，進度條追蹤
- 進度頁：技能分鐘數、近七日紀錄、語言／程度設定
- 資料保存在瀏覽器 `localStorage`
- 語音功能依瀏覽器而定；部分 iPhone Safari 可能不支援即時發音比對，仍可聽範讀跟讀

## 線上使用（iPhone / 任何裝置）

合併到 `main` 並在 GitHub 啟用 Pages 後，用瀏覽器打開：

**https://lucash2005.github.io/en-jp-learn/**

### 啟用 GitHub Pages（一次即可）

1. 打開倉庫 **Settings → Pages**
2. **Source** 選 **GitHub Actions**
3. 合併本 PR（或把 `main` 推上去）後，Actions 會自動建置並部署
4. 幾分鐘後用上方網址開啟；iPhone 可用 Safari，再「加入主畫面」

也可在 **Actions** 分頁手動跑 **Deploy GitHub Pages** workflow。

## 開發（需電腦）

```bash
npm install
npm run dev -- --host
```

## 建置

```bash
npm run build
npm run preview
```
