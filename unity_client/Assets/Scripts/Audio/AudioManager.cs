using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.Audio
{
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance;

        [Header("Audio Sources")]
        public AudioSource musicSource;   // Kênh Nhạc Nền (BGM)
        public AudioSource uiSource;      // Kênh Rút súng/Bấm Nút (UI/2D)

        [Header("3D Sound Pool (Tối ưu Âm Thanh Vòm)")]
        public GameObject soundEmitterPrefab;
        public int poolSize = 10;
        
        // Kho lưu trữ AudioSource trống tái sử dụng (Object Pooling chống rác RAM)
        private Queue<AudioSource> audioPool = new Queue<AudioSource>();

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;

            // Khởi tạo Hồ chứa âm thanh (Pool) 3D cho Tiếng Súng, Tiếng Chặt Cây...
            for (int i = 0; i < poolSize; i++)
            {
                GameObject emitter = new GameObject("SoundEmitter_" + i);
                emitter.transform.SetParent(transform);
                
                AudioSource src = emitter.AddComponent<AudioSource>();
                src.spatialBlend = 1f; // 100% Âm thanh Không Gian 3D (Nhạc từ xa nhỏ hơn, nghe từ tai trái/phải)
                src.minDistance = 2f;
                src.maxDistance = 50f;
                src.rolloffMode = AudioRolloffMode.Linear;
                src.playOnAwake = false;

                audioPool.Enqueue(src);
            }
        }

        // Phát Nhạc Nền Game (Background Music)
        public void PlayMusic(AudioClip musicClip, bool loop = true)
        {
            if (musicSource.clip == musicClip) return; // Đang chạy bài đấy rồi

            musicSource.clip = musicClip;
            musicSource.loop = loop;
            musicSource.Play();
        }

        // Phát Âm UI (Ting Ting Nhặt Đồ) To toàn màn hình không có Không Gian
        public void PlayUISound(AudioClip clip)
        {
            uiSource.PlayOneShot(clip);
        }

        // Phát Âm Vòm Âm Học 3D (Đạn nổ ở góc toạ độ X,Y,Z)
        public void Play3DSound(AudioClip clip, Vector3 position, float volume = 1f, float pitch = 1f)
        {
            if (clip == null || audioPool.Count == 0) return;

            // Rút 1 cái Loa trong kho ra xài
            AudioSource source = audioPool.Dequeue();
            
            source.transform.position = position;
            source.clip = clip;
            source.volume = volume;
            source.pitch = pitch; // Độ bổng/trầm (Pitch) đổi ngẫu nhiên nghe bớt nhàm chán
            source.Play();

            // Trả Loa lại vào kho nối đuôi hàng đợi theo chu kỳ chờ hết tiếng
            StartCoroutine(ReturnToPool(source, clip.length));
        }

        // Coroutine đếm ngược trả loa
        private System.Collections.IEnumerator ReturnToPool(AudioSource source, float delay)
        {
            yield return new WaitForSeconds(delay);
            source.Stop();
            audioPool.Enqueue(source);
        }
    }
}
