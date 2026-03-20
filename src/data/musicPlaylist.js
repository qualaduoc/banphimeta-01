// Free music URLs - nhạc nhẹ nhàng, dễ thương cho trẻ em
// Sử dụng các nguồn nhạc miễn phí hoặc user có thể thêm nhạc của mình
export const musicPlaylist = [
  {
    id: 1,
    title: 'Piano Nhẹ Nhàng',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    // Thay thế bằng local file: '/music/soft-piano-1.mp3'
    // Hoặc download từ: https://pixabay.com/music/ (search: soft piano children)
  },
  {
    id: 2,
    title: 'Melody Dễ Thương',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    // Thay thế bằng local file: '/music/cute-melody.mp3'
  },
  {
    id: 3,
    title: 'Lullaby Nhẹ Nhàng',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    // Thay thế bằng local file: '/music/lullaby-soft.mp3'
  },
];

// HƯỚNG DẪN THÊM NHẠC NHẸ NHÀNG, DỄ THƯƠNG:
// 
// CÁCH 1: Sử dụng Local Files (KHUYẾN NGHỊ)
// 1. Tạo folder: public/music/
// 2. Download nhạc free từ các nguồn:
//    - Pixabay Music: https://pixabay.com/music/
//      + Tìm kiếm: "soft piano", "lullaby", "children music", "gentle music"
//      + Download MP3 miễn phí (không cần attribution cho personal use)
//    - YouTube Audio Library: https://studio.youtube.com/channel/.../music
//      + Filter: Free music, Instrumental, Soft/Calm mood
//    - Incompetech: https://incompetech.com/music/royalty-free/
//      + Tìm kiếm: "lullaby", "soft", "gentle"
// 3. Đặt file vào: public/music/soft-piano-1.mp3
// 4. Update URL: '/music/soft-piano-1.mp3'
//
// CÁCH 2: Sử dụng Direct MP3 URLs (nếu có)
// - Đảm bảo URL ổn định và không vi phạm bản quyền
// - Test URL trước khi sử dụng
//
// GỢI Ý NHẠC PHÙ HỢP:
// - Soft Piano Music (nhạc piano nhẹ nhàng)
// - Lullaby Music (nhạc ru)
// - Children's Background Music (nhạc nền cho trẻ em)
// - Ambient Educational Music (nhạc nền giáo dục)
// - Gentle Instrumental Music (nhạc không lời nhẹ nhàng)
//
// Lưu ý:
// - Format: MP3 (tương thích tốt nhất với browsers)
// - Duration: 2-5 phút mỗi bài (để không quá dài)
// - Volume: Đảm bảo nhạc có volume đồng đều
// - License: Sử dụng nhạc free, không vi phạm bản quyền
