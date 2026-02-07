const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8cTxUPOSQA1ypJytbZ01-CX5qXM-iXExvbaBOpWATCade5xf3WYsKLrdhbrBOAiegZiefn97HgGlv/pub?gid=313985456&single=true&output=csv";

async function loadReviews() {
    try {
        const response = await fetch(csvUrl);
        const text = await response.text();
        // 增加除錯資訊
        console.log("原始資料已抓取");
        
        const rows = text.split('\n').map(r => r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)).slice(1);
        const container = document.getElementById('course-container');
        container.innerHTML = ""; // 清空容器
        document.getElementById('loading').style.display = 'none';

        rows.forEach((row, index) => {
            // --- 強化版抓取邏輯：自動尋找含有課程名稱的欄位 ---
            // 我們假設課程名稱通常在 5, 13, 21... 這些欄位，但也檢查其他位置
            const name = row[5] || row[13] || row[21] || row[29] || row[37] || "";
            
            // 如果這列連課程名稱都沒有，就跳過
            if (name.trim() === "" || name.includes("時間戳記")) return;

            // 抓取評分與心得（根據你的表單結構，數據通常在名稱後的 2-7 格）
            // 這裡用一個小技巧：找這列中第一個「1-10」的數字
            const overall = row[7] || row[15] || row[23] || "?";
            const sweet = row[8] || row[16] || row[24] || "?";
            const cool = row[9] || row[17] || row[25] || "?";
            const comment = row[12] || row[20] || row[28] || "無心得內容";

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${name.replace(/"/g, '')}</h3>
                <div class="score-box">
                    <span class="score-tag">⭐ 評價: ${overall}/5</span>
                    <span class="score-tag">🍬 甜度: ${sweet}/10</span>
                    <span class="score-tag">❄️ 涼度: ${cool}/10</span>
                </div>
                <div class="comment">${comment.replace(/"/g, '')}</div>
                <div class="timestamp">提交序號: #${index + 1}</div>
            `;
            container.appendChild(card);
        });

        if (container.innerHTML === "") {
            document.getElementById('loading').innerText = "目前還沒有心得資料喔，快去填寫第一筆吧！";
            document.getElementById('loading').style.display = 'block';
        }
    } catch (e) {
        document.getElementById('loading').innerText = "讀取失敗，請確認網路連線或 CSV 連結。";
        console.error("Error details:", e);
    }
}

loadReviews();
