using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

/// <summary>
/// 056~057회차 — 미니게임 ① 피하기의 매니저. 저장소에는 057 완성본만 있다.
///
///   056  점수를 Canvas 글자에 띄운다
///   057  플레이어가 죽으면 멈추고, R 로 다시 시작한다
///
/// 게임의 뼈대 네 줄이 이 파일에 다 들어 있다.
///   시작  씬을 연다
///   진행  점수가 쌓인다          Time.deltaTime + .text
///   끝    조건이 되면 멈춘다     null 확인 + Time.timeScale = 0
///   다시  처음으로 돌아간다      SceneManager.LoadScene
///
/// 060회차의 BreakoutManager 가 이것과 거의 같은 모양이다. 두 매니저를 나란히 놓고
/// "게임이 달라도 뼈대는 같다" 를 보여주는 것이 Phase 4 의 목적이다.
///
/// ⚠️ Time.timeScale 은 씬을 바꿔도 되돌아오지 않는다. LoadScene 앞에서 1 로 돌린다.
/// ⚠️ 이 씬을 Build Settings 에 추가해야 LoadScene 이 동작한다.
/// </summary>
public class DodgeGameManager : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI scoreText;
    [SerializeField] private GameObject gameOverText;

    // Health 가 Destroy 하면 이 참조가 null 이 된다 — 049 의 null 확인을 그대로 쓴다.
    [SerializeField] private GameObject player;

    private float score;

    // 값이 바뀔 때만 글자를 건드린다. 1초에 60번이 1번이 된다.
    private int shownScore = -1;

    private bool isGameOver;

    private void Update()
    {
        if (isGameOver)
        {
            if (Input.GetKeyDown(KeyCode.R))
            {
                Time.timeScale = 1f;

                SceneManager.LoadScene(SceneManager.GetActiveScene().name);
            }
            return;
        }

        if (player == null)
        {
            GameOver();
            return;
        }

        // 039: deltaTime 을 1초 동안 다 더하면 1이다. 그게 여기서 점수가 된다.
        score += Time.deltaTime;

        int now = Mathf.FloorToInt(score);

        if (now != shownScore)
        {
            shownScore = now;
            scoreText.text = "점수 " + now;
        }
    }

    private void GameOver()
    {
        isGameOver = true;

        gameOverText.SetActive(true);

        // 0 이면 물리도 코루틴도 전부 멈춘다. WaitForSeconds 도 안 간다.
        Time.timeScale = 0f;
    }
}
