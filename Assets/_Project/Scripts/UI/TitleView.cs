using UnityEngine;
using UnityEngine.UI;

// 타이틀 화면. 버튼 하나로 로비에 들여보낸다.
//
// 🔑 게임의 첫 씬이다. 여기서 시작해야 GameSession 이 깨끗한 상태로 출발한다.
public class TitleView : MonoBehaviour
{
    [SerializeField] private Button startButton;

    private void Start()
    {
        if (startButton != null) startButton.onClick.AddListener(SceneFlow.GoLobby);
    }
}
