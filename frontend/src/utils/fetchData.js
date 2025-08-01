// utils/fetchData.js
// fetch 관련 함수가 저장되어 있습니다.

/**
 * 지정된 URL에서 데이터를 비동기적으로 가져와 JSON으로 파싱하여 반환합니다.
 *
 * @async
 * @function fetchData
 * @param {string} url - 데이터를 가져올 URL입니다.
 * @returns {Promise<any>} JSON 데이터를 포함하는 프로미스를 반환합니다.
 * @throws {Error} 네트워크 요청 실패 혹은 응답이 정상적이지 않을 경우 예외를 발생시킵니다.
 *
 * @example
 * fetchData('https://api.example.com/data')
 *   .then(data => {
 *     console.log('가져온 데이터:', data);
 *   })
 *   .catch(error => {
 *     console.error('데이터를 가져오는 중 오류 발생:', error);
 *   });
 */
export const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Fetch 에러:", response.statusText);
      // throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("네트워크 에러:", error);
    throw error;
  }
};
