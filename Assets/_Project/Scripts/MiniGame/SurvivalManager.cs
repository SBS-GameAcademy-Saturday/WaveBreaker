using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;
using TMPro;

/// <summary>
/// 064~065회차 — 미니게임 ③ 의 매니저. 세 번째 매니저다.
///
/// 057 · 060 과 같은 뼈대를 세 번째로 쓴다. 065 수업에서는 이 표를 학생이 직접 채운다.
///
///   시작  씬을 연다              (자동)
///   진행  버틴 시간이 점수        Time.deltaTime          (056)
///   끝    플레이어가 죽으면       player == null          (057)
///   다시  R                      LoadScene               (057)
///
/// 웨이브 = 시간이 지나면 스폰 간격이 줄어든다. Phase 6 웨이브 매니저의 원형이다.
///   0초  웨이브 1  간격 2.00
///  10초  웨이브 2  간격 1.85
///  60초  웨이브 7  간격 1.10
/// 120초  웨이브 13 간격 0.25 (하한)
///
/// ⚠️ Mathf.Max 로 하한을 두지 않으면 간격이 0이나 음수가 되어 게임이 터진다.
///    050 의 Mathf.Clamp 와 같은 이야기다 — 범위를 벗어나지 않게 막는다.
/// </summary>
public class SurvivalManager : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI hudText;
    [SerializeField] private TextMeshProUGUI resultText;

    [SerializeField] private GameObject player;
    [SerializeField] private EnemySpawner spawner;

    [SerializeField] private float rampInterval = 10f;
    [SerializeField] private float intervalStep = 0.15f;
    [SerializeField] private float minInterval = 0.25f;

    private float survivedTime;
    private int shownTime = -1;
    private int waveLevel = 1;
    private bool isOver;

    private void Start()
    {
        StartCoroutine(RampRoutine());

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

        if (player == null)
        {
            Finish();
            return;
        }

        survivedTime += Time.deltaTime;

        int now = Mathf.FloorToInt(survivedTime);

        if (now != shownTime)
        {
            shownTime = now;
            UpdateHud();
        }
    }

    private IEnumerator RampRoutine()
    {
        while (true)
        {
            yield return new WaitForSeconds(rampInterval);

            // yield break 는 코루틴을 끝낸다. return 과 같은 자리다.
            if (isOver) yield break;

            waveLevel++;
            spawner.SpeedUp(intervalStep, minInterval);

            UpdateHud();
        }
    }

    private void Finish()
    {
        if (isOver) return;

        isOver = true;

        // 결과에 숫자를 보여주면 다시 하고 싶어진다. 기술이 아니라 판단이다.
        resultText.text = shownTime + "초 버텼습니다\n웨이브 " + waveLevel + " 도달\n\nR 키로 다시";
        resultText.gameObject.SetActive(true);

        Time.timeScale = 0f;
    }

    private void UpdateHud()
    {
        if (hudText != null)
        {
            hudText.text = "생존 " + Mathf.Max(shownTime, 0) + "초     웨이브 " + waveLevel;
        }
    }
}
