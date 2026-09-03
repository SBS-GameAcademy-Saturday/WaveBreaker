using Unity.Netcode;

// 117회차 · "지금 내가 만들어도 되는가" 를 한 곳에서 답한다.
//
// 🔑 협동을 붙이면서 싱글을 깨뜨리지 않는 방법이 이것이다.
//
//    협동일 때 : 서버(호스트)만 true
//    싱글일 때 : NetworkManager 가 아예 없거나 안 켜져 있으니 → true
//
//    즉 싱글은 "호스트 혼자 하는 게임" 으로 취급된다.
//    그래서 본 게임 코드에 if / else 분기가 하나도 안 생긴다.
public static class NetworkRole
{
    public static bool IsServerOrOffline
    {
        get
        {
            NetworkManager nm = NetworkManager.Singleton;

            // 씬에 NetworkManager 가 없다 = 싱글 모드다
            if (nm == null) return true;

            // 있어도 접속을 안 했으면 싱글과 같다
            if (!nm.IsListening) return true;

            return nm.IsServer;
        }
    }

    // 협동 중인가. 화면 표시 같은 데만 쓴다.
    public static bool IsNetworked
    {
        get
        {
            NetworkManager nm = NetworkManager.Singleton;
            return nm != null && nm.IsListening;
        }
    }
}
