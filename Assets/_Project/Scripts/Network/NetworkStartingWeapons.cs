using Unity.Netcode;
using UnityEngine;

// 협동판 StartingWeapons. 하는 일은 같고, **주는 쪽이 서버** 라는 것만 다르다.
//
// 🔑 왜 서버만 주나
//    무기를 가졌는지는 NetworkVariable 이고, 그건 서버가 쓰는 값이다(107).
//    각자 자기 화면에서 줘 봐야 사본만 바뀌고 서버는 모른다.
//
// 🔑 왜 Start() 가 아니라 OnNetworkSpawn() 인가
//    스폰되기 전에 NetworkVariable 을 건드리면 예외가 난다.
//    "네트워크에 올라온 뒤" 를 보장하는 자리가 여기다.
public class NetworkStartingWeapons : NetworkBehaviour
{
    [SerializeField] private MonoBehaviour[] weapons;

    public override void OnNetworkSpawn()
    {
        if (!IsServer) return;

        foreach (MonoBehaviour item in weapons)
        {
            if (item == null) continue;

            if (item is IWeapon weapon)
            {
                weapon.Acquire();
                continue;
            }

            Debug.LogWarning($"{item.GetType().Name} 은 무기가 아니다 — IWeapon 이 없다", item);
        }
    }
}
