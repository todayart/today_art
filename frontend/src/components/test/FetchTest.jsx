export default function FetchTest() {
  const handleApiRequest = () => {
    // 이 엔드포인트, 즉 url만 바꾸면 get 요청이 날라간다.
    fetch("http://127.0.0.1:8000/events/getData")
      .then((response) => {
        console.log(response);
        return response.json(); // 2번째 then에 전달과 데이터 표시를 위한 결과값 반환
      })
      .then((response) => console.log(`type : ${typeof response}`))
      .catch((error) => console.error(error));
  };

  return <button onClick={handleApiRequest}>Send API Request</button>;
}
### 스켈레톤 완성하고 자ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ