using System.Collections.Generic;
using UnityEngine;

// 100회차 · 소리를 내는 곳을 한 군데로 모은다.
//
// 몬스터마다 AudioSource 를 붙이면 30마리가 동시에 죽을 때 소리가 30개 겹쳐 시끄럽다.
// 여기 하나만 두고, 같은 소리는 최소 간격을 두고 낸다.
public class AudioManager : MonoBehaviour
{
    public static AudioManager Instance { get; private set; }

    [SerializeField] private AudioSource source;
    [SerializeField] private float minGap = 0.05f;

    // 어떤 소리를 마지막으로 언제 냈는지. 소리별로 따로 센다.
    private readonly Dictionary<AudioClip, float> lastPlayed = new Dictionary<AudioClip, float>();

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;

        if (source == null) source = GetComponent<AudioSource>();
    }

    public void Play(AudioClip clip, float volume = 1f)
    {
        if (clip == null || source == null) return;

        // 멈춰 있어도 소리는 나야 한다. 버튼 소리가 그 예다.
        if (lastPlayed.TryGetValue(clip, out float last))
        {
            if (Time.unscaledTime - last < minGap) return;
        }

        lastPlayed[clip] = Time.unscaledTime;

        source.PlayOneShot(clip, volume);
    }
}
