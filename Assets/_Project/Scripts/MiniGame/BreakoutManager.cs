using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;
using TMPro;

/// <summary>
/// 060회차 — 미니게임 ② 벽돌깨기의 매니저.
///
/// 057 의 DodgeGameManager 와 나란히 놓고 읽는다. 게임은 완전히 다른데 뼈대는 같다.
///
///   하는 일       057 (피하기)         060 (벽돌깨기)
///   죽음 감지     player == null       ball == null
///   한 번만       isGameOver           isOver
///   멈춤          Time.timeScale = 0   같다
///   재시작        LoadScene(...)       같다
///   끝나는 방법   죽음 하나            죽음 + 클리어 둘
///
/// 왜 클리어 판정이 코루틴인가
///   FindGameObjectsWithTag 는 씬 전체를 뒤지는 무거운 함수라 매 프레임 부르면 안 된다.
///   0.5초에 한 번이면 사람 눈에는 즉시로 보인다. 051 의 코루틴이 여기서 이렇게 쓰인다.
///
/// 왜 Finish 에 if (isOver) return; 이 있나
///   마지막 블록을 깨면서 공을 놓치면 클리어와 게임오버가 거의 동시에 일어난다.
///   먼저 들어온 쪽으로 끝낸다.
/// </summary>
public class BreakoutManager : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI resultText;
    [SerializeField] private GameObject ball;

    [SerializeField] private float clearCheckInterval = 0.5f;

    private bool isOver;

    private void Start()
    {
        StartCoroutine(CheckClearRoutine());
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

        if (ball == null)
        {
            Finish("게임 오버  —  R 키로 다시");
        }
    }

    private IEnumerator CheckClearRoutine()
    {
        while (true)
        {
            // 먼저 쉰다. 블록이 깔리기 전에 세면 시작하자마자 클리어가 된다.
            yield return new WaitForSeconds(clearCheckInterval);

            if (GameObject.FindGameObjectsWithTag("Brick").Length == 0)
            {
                Finish("클리어!  —  R 키로 다시");
            }
        }
    }

    private void Finish(string message)
    {
        if (isOver) return;

        isOver = true;

        resultText.text = message;
        resultText.gameObject.SetActive(true);

        Time.timeScale = 0f;
    }
}
