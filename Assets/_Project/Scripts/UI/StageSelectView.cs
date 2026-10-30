using UnityEngine;
using UnityEngine.UI;

// 로비의 스테이지 선택. 버튼 하나가 StageData 하나다.
//
// 🔑 그림도 글씨도 **씬에 박혀 있다**. 여기서는 버튼만 연결한다.
//    런타임에 안 바꾸니 Scene 뷰에서 보이는 그대로가 결과다.
public class StageSelectView : MonoBehaviour
{
    [SerializeField] private StageData[] stages;
    [SerializeField] private Button[] buttons;

    private void Start()
    {
        for (int i = 0; i < buttons.Length; i++)
        {
            bool on = i < stages.Length && stages[i] != null;
            if (buttons[i] != null) buttons[i].gameObject.SetActive(on);
            if (!on) continue;

            StageData s = stages[i];
            buttons[i].onClick.RemoveAllListeners();
            buttons[i].onClick.AddListener(() => SceneFlow.GoGame(s));
        }
    }
}
