// 070회차 · 맞을 수 있다는 약속.
// 부모가 서로 다른 클래스(Enemy, PlayerHealth)를 같은 방식으로 때리기 위해 쓴다.
public interface IDamageable
{
    void TakeDamage(int amount);
}
