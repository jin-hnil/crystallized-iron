using UnityEngine;
using System;

public class PlayerSurvival : MonoBehaviour
{
    [Header("Survival Stats (Theo tài liệu GDD)")]
    public float maxHealth = 100f;
    public float currentHealth;

    public float maxArmor = 100f;
    public float currentArmor;

    public float maxHunger = 100f;
    public float currentHunger;

    public float maxThirst = 100f;
    public float currentThirst;

    [Header("Depletion Rates (Per Second)")]
    public float hungerDepletionRate = 0.5f;
    public float thirstDepletionRate = 0.75f; // Khát tụt nhanh hơn đói 1.5x

    [Header("Damage Rates")]
    public float starvationDamageRate = 1f; // Mất máu mỗi giây khi bụng rỗng
    public float dehydrationDamageRate = 2f; // Mất máu mỗi giây khi hết nước

    public bool IsDead { get; private set; }

    public event Action OnDeath;

    private void Start()
    {
        currentHealth = maxHealth;
        currentArmor = 0; // Khởi đầu không có giáp
        currentHunger = maxHunger;
        currentThirst = maxThirst;
        IsDead = false;
    }

    private void Update()
    {
        if (IsDead) return;

        HandleSurvivalStats();
    }

    private void HandleSurvivalStats()
    {
        // Giảm thanh Đói theo thời gian
        if (currentHunger > 0)
        {
            currentHunger -= hungerDepletionRate * Time.deltaTime;
        }
        else
        {
            currentHunger = 0;
            TakeDamage(starvationDamageRate * Time.deltaTime, true); // Bỏ qua giáp khi mất máu do đói
        }

        // Giảm thanh Khát theo thời gian
        if (currentThirst > 0)
        {
            currentThirst -= thirstDepletionRate * Time.deltaTime;
        }
        else
        {
            currentThirst = 0;
            TakeDamage(dehydrationDamageRate * Time.deltaTime, true); // Bỏ qua giáp khi mất máu do khát
        }
    }

    // Hàm nhận sát thương
    public void TakeDamage(float amount, bool ignoreArmor = false)
    {
        if (IsDead) return;

        if (!ignoreArmor && currentArmor > 0)
        {
            // Cơ chế cản sát thương của Giáp. Ví dụ: Giáp cản 50% sát thương.
            float damageToArmor = amount * 0.5f;
            float damageToHealth = amount - damageToArmor;

            // Trừ độ cứng của Giáp trước
            if (currentArmor >= damageToArmor)
            {
                currentArmor -= damageToArmor;
            }
            else
            {
                // Giáp bị vỡ hoàn toàn, phần sát thương dư dội thẳng vào Máu
                damageToHealth += (damageToArmor - currentArmor);
                currentArmor = 0;
            }

            currentHealth -= damageToHealth;
        }
        else
        {
            // Bị sát thương trực tiếp (Ví dụ rơi từ trên cao, hoặc đói khát)
            currentHealth -= amount;
        }

        if (currentHealth <= 0)
        {
            Die();
        }
    }

    private void Die()
    {
        currentHealth = 0;
        IsDead = true;
        Debug.Log("Player has died.");
        OnDeath?.Invoke();
        // TODO: Xử lý rớt Balo (Loot sack) ra đất khi người chơi chết
    }

    // Các hàm hồi phục
    public void Heal(float amount)
    {
        if (IsDead) return;
        currentHealth = Mathf.Min(currentHealth + amount, maxHealth);
    }

    public void Eat(float amount)
    {
        if (IsDead) return;
        currentHunger = Mathf.Min(currentHunger + amount, maxHunger);
    }

    public void Drink(float amount)
    {
        if (IsDead) return;
        currentThirst = Mathf.Min(currentThirst + amount, maxThirst);
    }
    
    public void RepairArmor(float amount)
    {
        if (IsDead) return;
        currentArmor = Mathf.Min(currentArmor + amount, maxArmor);
    }
}
