using TMPro;
using UnityEngine;
using UnityEngine.UI;

// 094회차 · 숫자 대신 "길이" 로 보여준다.
// Image 의 Image Type 을 Filled 로 두면 fillAmount(0~1) 만큼만 그려진다.
// 체력바든 경험치바든 하는 일이 똑같아서 스크립트 하나로 둘 다 쓴다.
public class StatBar : MonoBehaviour
{
    [SerializeField] private Image fill;
    [SerializeField] private TMP_Text label;
    [SerializeField] private string format = "{0} / {1}";

    public void Set(int current, int max)
    {
        // 0 으로 나누면 NaN 이 나오고 바가 통째로 사라진다.
        if (fill != null) fill.fillAmount = max > 0 ? (float)current / max : 0f;

        if (label != null) label.text = string.Format(format, current, max);
    }
}
