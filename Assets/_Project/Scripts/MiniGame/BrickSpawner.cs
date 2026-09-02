using UnityEngine;

/// <summary>
/// 058회차 — 4주차 2차원 배열 출력과 구조가 같다. Console.Write 자리에 Instantiate 가 들어간다.
///
///     for (row)  for (col)  Console.Write(map[row, col]);      4주차 콘솔
///     for (row)  for (col)  Instantiate(brick, 계산한 좌표);     오늘
///
/// 오늘의 전부는 "인덱스를 좌표로 바꾸는 계산" 이다.
///   col  ->  startX + col * spacingX      오른쪽으로
///   row  ->  startY - row * spacingY      아래로 (빼기 — 032 에서 위가 +y 였다)
///
/// 가운데 정렬에서 -1 을 하는 이유: 블록이 10개면 간격은 9개다.
/// </summary>
public class BrickSpawner : MonoBehaviour
{
    [SerializeField] private GameObject brickPrefab;

    [SerializeField] private int rows = 5;
    [SerializeField] private int columns = 10;
    [SerializeField] private float spacingX = 1.2f;
    [SerializeField] private float spacingY = 0.6f;
    [SerializeField] private float startY = 3f;

    // 행마다 다른 색. Inspector 에서 채운다 (4주차 배열).
    [SerializeField] private Color[] rowColors;

    private void Start()
    {
        float startX = -(columns - 1) * spacingX / 2f;

        for (int row = 0; row < rows; row++)
        {
            for (int col = 0; col < columns; col++)
            {
                float x = startX + col * spacingX;
                float y = startY - row * spacingY;

                // 047 에서는 만들고 버렸지만, 오늘은 색을 칠해야 해서 받아둔다.
                GameObject brick = Instantiate(brickPrefab, new Vector3(x, y, 0f), Quaternion.identity);
                brick.transform.SetParent(transform, true);

                if (rowColors.Length > 0)
                {
                    // 3주차 나머지 연산. 색이 모자라도 돌려 쓴다.
                    brick.GetComponent<SpriteRenderer>().color = rowColors[row % rowColors.Length];
                }
            }
        }
    }
}
