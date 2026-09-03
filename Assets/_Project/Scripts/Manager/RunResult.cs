// 097회차 · 씬을 넘겨도 안 사라지는 자리.
//
// GameManager 는 Game 씬의 오브젝트다. 씬이 바뀌면 통째로 사라지고,
// 그 안에 들어 있던 처치 수도 같이 사라진다. 그래서 결과 화면에 0 이 뜬다.
//
// static 은 오브젝트가 아니라 "클래스 자체" 에 붙는다. 씬과 상관없이 살아 있다.
// 게임이 완전히 꺼지면 사라진다. 그건 우리가 원하는 동작이다.
public static class RunResult
{
    public static float Time;
    public static int Kills;
    public static int Level;
    public static bool Cleared;

    public static void Record(float time, int kills, int level, bool cleared)
    {
        Time = time;
        Kills = kills;
        Level = level;
        Cleared = cleared;
    }
}
