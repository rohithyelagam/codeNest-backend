 
const sendResp = async (resp, message,status,code)=>{
    const data = {
        message:message,
        status:status
    }
    await resp.status(code).send(data);
}

const getScore = (X,Y,m,n)=>{

    var L = [];
    for(var i=0;i<=m;i++){
        let tempArr = [];
        for(var j=0;j<=n;j++){
            tempArr.push(0);
        }
        L.push(tempArr);
    }

    for (var i = 0; i <= m; i++) {
        for (var j = 0; j <= n; j++) {

            if (i == 0 || j == 0)
                L[i][j] = 0;

            else if (X[i - 1] == Y[j - 1])
                L[i][j] = L[i - 1][j - 1] + 1;

            else
                L[i][j] = Math.max(L[i - 1][j], L[i][j - 1]);
        }
    }

    return L[m][n];
}

const getCodeExtension = (lang)=>{
    switch(lang){
        case "CPP":
        case "C":
            return ".cpp";
            break;
        case "JAVA":
            return ".java";
            break;
        case "PYTHON":
            return ".py";
            break;
        default:
            return ".txt";
            break;
    }
}

module.exports = {sendResp,getScore,getCodeExtension};