const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8cTxUPOSQA1ypJytbZ01-CX5qXM-iXExvbaBOpWATCade5xf3WYsKLrdhbrBOAiegZiefn97HgGlv/pub?gid=313985456&single=true&output=csv";

async function loadReviews() {
    try {
        const response = await fetch(csvUrl);
        const text = await response.text();
        const rows = text.split('\n').map(r => r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)).slice(1);
        
        const container = document.getElementById('course-container');
        document.getElementById('loading').style.display = 'none';

        rows.forEach(row => {
            // 自動偵測不同區段的課程名稱 (F, N, V, AD, AL...)
            const name = row[5] || row[13] || row[21] || row[29] || row[37];
            const overall = row[7] || row[15] || row[23] || row[31] || row[39];
            const sweet = row[8] || row[16] || row[24] || row[32] || row[40];
            const cool = row[9] || row[17] || row[25] || row[33] || row[41];
            const gain = row[10] || row[18] || row[26] || row[34] || row[42];
            const score = row[11] || row[19] || row[27] || row[35] || row[43];
            const comment = row[12] || row[20] || row[28] || row[36] || row[44];

            if (!name || name.trim() === "") return;

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${name}</h3>
                <div class="score-box">
                    <span class="score-tag">⭐ 評價: ${overall}/5</span>
                    <span class="score-tag">🍬 甜度: ${sweet}/10</span>
                    <span class="score-tag">❄️ 涼度: ${cool}/10</span>
                    <span class="score-tag">🎓 收穫: ${gain}/10</span>
                    <span class="score-tag">💯 成績: ${score || '未提供'}</span>
                </div>
                <div class="comment">${comment || '這位學長姐很懶，什麼都沒寫🫠'}</div>
                <div class="timestamp">提交時間: ${row[0]}</div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        document.getElementById('loading').innerText = "讀取失敗，請確認試算表已發布到網路。";
        console.error(e);
    }
}

loadReviews();
