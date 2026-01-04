// 檔案路徑: assets/js/utils.js

/**
    包含：iOS 相容的剪貼簿複製功能
 */
function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // 關鍵：避免畫面跳動與鍵盤彈出
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.width = "1px";
    textarea.style.height = "1px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    // iOS 關鍵順序
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    let success = false;
    try {
        success = document.execCommand("copy");
    } catch (e) {
        success = false;
    }

    document.body.removeChild(textarea);

    alert(success ? "✅ 題目已複製，請貼到 AI" : "❌ 複製失敗，請長按手動複製");
}