using System.Collections;
using UnityEngine;

// 맞았을 때 잠깐 깜빡인다. 몬스터·플레이어가 **같은 스크립트**를 쓴다.
//
// 🔑 "누가 맞았나" 를 안 본다. SpriteRenderer 만 있으면 된다.
//    그래서 한 번 만들어 두 군데에 붙인다.
[RequireComponent(typeof(SpriteRenderer))]
public class Flicker : MonoBehaviour
{
    [SerializeField] private Color hitColor = new Color(1f, 0.4f, 0.4f);
    [SerializeField] private float duration = 0.12f;
    [SerializeField] private int blinks = 2;

    private SpriteRenderer sr;
    private Color baseColor;
    private Coroutine running;

    private void Awake()
    {
        sr = GetComponent<SpriteRenderer>();
        baseColor = sr.color;
    }

    public void Play()
    {
        // 🚨 이미 깜빡이는 중이면 멈추고 다시 시작한다.
        //    안 그러면 두 코루틴이 색을 서로 덮어써서 원래 색으로 안 돌아온다.
        if (running != null) StopCoroutine(running);

        running = StartCoroutine(Run());
    }

    private IEnumerator Run()
    {
        float half = duration / (blinks * 2f);

        for (int i = 0; i < blinks; i++)
        {
            sr.color = hitColor;
            yield return new WaitForSeconds(half);
            sr.color = baseColor;
            yield return new WaitForSeconds(half);
        }

        sr.color = baseColor;
        running = null;
    }

    // 데이터로 색을 바꿀 때 쓴다 (EnemyData.tint)
    public void SetBaseColor(Color c)
    {
        baseColor = c;
        if (running == null && sr != null) sr.color = c;
    }
}
