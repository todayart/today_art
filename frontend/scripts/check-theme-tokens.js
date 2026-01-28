const fs = require("fs");
const path = require("path");

// * __dirname은 현재 스크립트 파일의 디렉토리 경로를 나타냄. 어디서든 바른 참조 가능
const themesPath = path.join(
  __dirname,
  "..",
  "src",
  "contents",
  "themeTokens.json",
);

const raw = fs.readFileSync(themesPath, "utf8");
let data;

// JSON 파싱 시도
try {
  data = JSON.parse(raw);
} catch (err) {
  throw new Error("themeTokens.json 파싱에 실패했습니다.");
}

const themes = Array.isArray(data) ? data : data.themes;

// 유효성 검사
if (!Array.isArray(themes) || themes.length === 0) {
  throw new Error("themeTokens.json에 themes 배열이 필요합니다.");
}

// Set을 사용해 중복 검사
// 각 테마 객체의 value와 name이 올바른지 검사
const seen = new Set();
themes.forEach((theme, index) => {
  if (!theme || typeof theme !== "object") {
    throw new Error(`themes[${index}]는 객체여야 합니다.`);
  }
  if (!theme.value || typeof theme.value !== "string") {
    throw new Error(`themes[${index}].value가 필요합니다.`);
  }
  if (!theme.name || typeof theme.name !== "string") {
    throw new Error(`themes[${index}].name가 필요합니다.`);
  }
  if (seen.has(theme.value)) {
    throw new Error(`중복된 theme value가 있습니다: ${theme.value}`);
  }
  seen.add(theme.value);
});
