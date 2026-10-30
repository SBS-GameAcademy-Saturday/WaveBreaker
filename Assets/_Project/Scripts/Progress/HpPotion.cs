using UnityEngine;

public class HpPotion : MonoBehaviour
{
    [SerializeField] private int hpRestore = 10;
    
    private Transform player;
    private PlayerHealth health;
    
    public void Setup(int value) => hpRestore = value;
    
    private void Start()
    {
        GameObject p = GameObject.FindWithTag("Player");
        if (p == null) return;
        
        player = p.transform;
        health = p.GetComponent<PlayerHealth>();
    }
    
    private void Update()
    {
        if (player == null || health == null) return;

        float d = Vector2.Distance(transform.position, player.position);
        
        
        if (d < 0.5f)
        {
            health.AddHealth(hpRestore);
            Destroy(gameObject);
            return;
        }
    }
}
