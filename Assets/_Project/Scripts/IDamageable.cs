// 070회차 · 6주차에 콘솔로 짠 그 인터페이스다. 한 글자도 안 바뀐다.
//
// 🔑 "맞을 수 있는 것" 을 하나로 묶는다.
//    때리는 쪽은 상대가 몬스터인지 플레이어인지 상자인지 알 필요가 없다.
//    TakeDamage 가 있으면 때릴 수 있다.
public interface IDamageable
{
    void TakeDamage(int amount);
}
