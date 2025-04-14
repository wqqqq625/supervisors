
let supervisorsData = [];


function loadCSVData() {
    Papa.parse("supervisors.csv", {
        download: true,
        header: true,
        complete: function(results) {
            supervisorsData = results.data;
            console.log("导师数据加载完成", supervisorsData);
        }
    });
}


function calculateMatch(studentInterest, supervisorInterest) {

    const studentTerms = studentInterest.toLowerCase().split(/[,\s]+/);
    const supervisorTerms = supervisorInterest.toLowerCase().split(/[,\s]+/);
    

    const commonTerms = studentTerms.filter(term => 
        supervisorTerms.includes(term)
    );
    

    return commonTerms.length / Math.sqrt(studentTerms.length * supervisorTerms.length);
}

function findSupervisors() {
    const interestInput = document.getElementById('interestInput').value.trim();
    const resultsDiv = document.getElementById('results');
    
    if (!interestInput) {
        resultsDiv.innerHTML = "<p>请输入研究兴趣</p>";
        return;
    }
    

    const results = supervisorsData.map(supervisor => {
        return {
            ...supervisor,
            similarity: calculateMatch(interestInput, supervisor.researchinterests)
        };
    });
    

    const topMatches = results.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
    

    if (topMatches[0].similarity === 0) {
        resultsDiv.innerHTML = "<p>没有找到匹配的导师，请尝试其他关键词</p>";
    } else {
        let html = "<h2>推荐导师</h2>";
        topMatches.forEach(supervisor => {
            html += `
                <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd;">
                    <h3>${supervisor.name}</h3>
                    <p>机构: ${supervisor.institution}</p>
                    <p>职称: ${supervisor.title}</p>
                    <p>研究方向: ${supervisor.researchinterests}</p>
                    <p>邮箱: ${supervisor.email}</p>
                    <p>匹配度: ${supervisor.similarity.toFixed(2)}</p>
                </div>
            `;
        });
        resultsDiv.innerHTML = html;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    loadCSVData();
    document.getElementById('searchButton').addEventListener('click', findSupervisors);
});