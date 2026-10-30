using TMPro;
using UnityEngine;
using UnityEngine.UI;

// 로비의 스테이지 선택. 버튼 하나가 StageData 하나다.
//
// 🔑 스테이지를 늘리려면 **에셋을 하나 더 만들고 배열에 넣으면** 된다.
public class StageSelectView : MonoBehaviour
{
    [SerializeField] private StageData[] stages;
    [SerializeField] private Button[] buttons;
    [SerializeField] private TMP_Text[] titles;
    [SerializeField] private TMP_Text[] descs;
    [SerializeField] private Image[] thumbs;

    private void Start()
    {
        for (int i = 0; i < buttons.Length; i++)
        {
            bool on = i < stages.Length && stages[i] != null;
            if (buttons[i] != null) buttons[i].gameObject.SetActive(on);
            if (!on) continue;

            StageData s = stages[i];
            if (titles[i] != null) titles[i].text = s.title;
            if (descs[i] != null) descs[i].text = $"{s.description}\n\n{s.surviveSeconds / 60f:F0}분 버티기";

            if (i < thumbs.Length && thumbs[i] != null && s.thumbnail != null)
            {
                thumbs[i].sprite = s.thumbnail;
            }

            buttons[i].onClick.RemoveAllListeners();
            buttons[i].onClick.AddListener(() => SceneFlow.GoGame(s));
        }
    }
}
