const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const themesPath = path.join(rootDir, "src", "contents", "themeTokens.json");
const indexPath = path.join(rootDir, "public", "index.html");

const data = JSON.parse(fs.readFileSync(themesPath, "utf8"));
const themes = Array.isArray(data) ? data : data.themes;

// 유효성 검사
if (!Array.isArray(themes)) {
  throw new Error("themeTokens.json에 themes 배열이 필요합니다.");
}

// 허용된 테마 값으로 allowlist 생성
const allowlist = themes.reduce((acc, theme) => {
  if (theme && theme.value) {
    acc[theme.value] = true;
  }
  return acc;
}, {});

// index.html 파일 읽기
const html = fs.readFileSync(indexPath, "utf8");
const allowlistJson = JSON.stringify(allowlist);

// index.html 파일에서 'var allowed =' 구문을 찾아 대체
const replaced = html.replace(
  /var allowed = [^;]*;/,
  `var allowed = ${allowlistJson};`,
);

// 변경 사항이 없으면 오류 발생
if (replaced === html) {
  throw new Error("index.html에서 'var allowed =' 구문을 찾지 못했습니다.");
}

// index.html 파일에 다시 쓰기
fs.writeFileSync(indexPath, replaced, "utf8");
