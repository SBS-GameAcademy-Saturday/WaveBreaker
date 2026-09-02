using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;
using TMPro;

/// <summary>
/// 060~061회차 — 미니게임 ② 벽돌깨기의 매니저. 저장소에는 061 완성본만 있다.
///
///   060  공을 놓치면 게임오버 / 블록을 다 깨면 클리어
///   061  목숨 3개 + 점수 + 1초 뒤 공 재생성
///
/// 057 의 DodgeGameManager 와 나란히 놓고 읽는다. 게임은 다른데 뼈대는 같다.
///   죽음 감지 ball == null   /  한 번만 isOver  /  멈춤 timeScale = 0  /  재시작 LoadScene
///
/// ⚠️ isRespawning 이 이 회차의 최다 사고다.
///    없으면 ball == null 인 동안 Update 가 매 프레임 목숨을 깎아 순식간에 0이 된다.
///    057 의 isGameOver, 060 의 isOver 와 같은 "한 번만 실행되게 하는 표시" 다.
///
/// 왜 Invoke 인가
///   "1초 뒤에 이거 해줘" 한 줄이면 되는 일에 코루틴은 과하다.
///   nameof 를 쓰는 이유는 049 의 CompareTag 와 같다 — 오타를 컴파일 에러로 잡으려고.
/// </summary>
public class BreakoutManager : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI hudText;
    [SerializeField] private TextMeshProUGUI resultText;

    [SerializeField] private GameObject ballPrefab;
    [SerializeField] private Transform ballSpawnPoint;

    [SerializeField] private int maxLives = 3;
    [SerializeField] private int scorePerBrick = 10;
    [SerializeField] private float clearCheckInterval = 0.5f;
    [SerializeField] private float respawnDelay = 1f;

    private GameObject ball;
    private int lives;
    private int score;

    // 코루틴 첫 줄에서 기록한다. 아래 CheckClearRoutine 주석 참고.
    private int lastBrickCount;

    private bool isOver;
    private bool isRespawning;

    private void Start()
    {
        lives = maxLives;

        RespawnBall();
        StartCoroutine(CheckClearRoutine());

        UpdateHud();
    }

    private void Update()
    {
        if (isOver)
        {
            if (Input.GetKeyDown(KeyCode.R))
            {
                Time.timeScale = 1f;

                SceneManager.LoadScene(SceneManager.GetActiveScene().name);
            }
            return;
        }

        // 재생성을 기다리는 동안에는 아래를 실행하지 않는다. 이 줄이 없으면 목숨이 한 번에 0이 된다.
        if (isRespawning) return;

        if (ball == null)
        {
            lives--;
            UpdateHud();

            if (lives <= 0)
            {
                Finish("게임 오버  —  R 키로 다시");
            }
            else
            {
                isRespawning = true;
                Invoke(nameof(RespawnBall), respawnDelay);
            }
        }
    }

    private void RespawnBall()
    {
        ball = Instantiate(ballPrefab, ballSpawnPoint.position, Quaternion.identity);

        isRespawning = false;
    }

    private IEnumerator CheckClearRoutine()
    {
        // 한 프레임 기다린다. Start 실행 순서는 정해져 있지 않아서, 이 시점에는
        // BrickSpawner.Start 가 아직 안 돌았을 수 있다. 한 프레임 뒤면 전부 끝나 있다.
        yield return null;

        // 첫 개수를 여기서 기록한다. 첫 바퀴(0.5초)까지 기다렸다 기록하면
        // 그 사이에 깨진 블록이 점수에 안 잡힌다 — 실제로 한 개가 빠졌다.
        lastBrickCount = GameObject.FindGameObjectsWithTag("Brick").Length;

        while (true)
        {
            yield return new WaitForSeconds(clearCheckInterval);

            if (isOver) yield break;

            int now = GameObject.FindGameObjectsWithTag("Brick").Length;

            // 이미 세고 있던 값을 한 번 더 쓴다. 줄어든 개수만큼 점수를 준다.
            if (now < lastBrickCount)
            {
                score += (lastBrickCount - now) * scorePerBrick;
                UpdateHud();
            }

            lastBrickCount = now;

            if (now == 0)
            {
                Finish("클리어!  —  R 키로 다시");
            }
        }
    }

    private void Finish(string message)
    {
        if (isOver) return;

        isOver = true;

        // 예약해 둔 재생성이 남아 있으면 취소한다. 안 하면 게임오버 후에도 공이 생긴다.
        CancelInvoke();

        resultText.text = message;
        resultText.gameObject.SetActive(true);

        Time.timeScale = 0f;
    }

    // 값이 바뀌는 자리에서만 부른다. Update 에서 매 프레임 부르지 않는다 (056).
    private void UpdateHud()
    {
        if (hudText != null)
        {
            hudText.text = "점수 " + score + "     목숨 " + lives;
        }
    }
}
